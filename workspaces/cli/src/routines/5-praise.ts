import { DB_NAME, DB_URL, IBlueprint, toMinSec } from '@sepraisal/common'
import { lstatSync } from 'fs'
import { MongoClient } from 'mongodb'
import { cpus } from 'os'
import * as pad from 'pad'
import * as workerFarm from 'worker-farm'

import { QUERIES } from '../queries'
import { sbcPath } from '../utils'

// tslint:disable:no-unsafe-any - because `response` is not typed.
// tslint:disable:object-literal-sort-keys member-ordering max-line-length

interface IProjection {
    _id: number,
    steam: {
        revision: number,
    },
}


const isDebug = process.argv.findIndex((arg) => arg.includes('--debug')) !== -1
const farmOptions = {
    workerOptions               : {
        ...(isDebug ? {execArgv: ['--inspect-brk=49999']} : {}),
    },
    maxCallsPerWorker           : 1,
    maxConcurrentWorkers        : isDebug ? 1 : cpus().length,
    maxConcurrentCallsPerWorker : 1,
    maxConcurrentCalls          : Infinity,
    maxCallTime                 : isDebug ? Infinity : 10 * 1000,
    maxRetries                  : 1,
    autoStart                   : false,
}
const workers = workerFarm(farmOptions, require.resolve(`./5-praiseWorker.${__filename.slice(-2)}`))
const queueWork = async (index: number, doc: IProjection) => new Promise<void>(
        // tslint:disable-next-line:no-void-expression
        (resolve, reject) => workers(index, doc, (err: Error | void, msg: void) => err ? reject(err) : resolve(msg)),
    )


type IJobResult = 'TimeoutError' | 'read' | 'praise' | 'update' | null
const praised = new Map<number, IJobResult>()


export const main = async () => {

    const timer = Date.now()
    const client = await MongoClient.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    console.info(`Database connection established (master).`)
    const db = client.db(DB_NAME)
    const collection = db.collection<IProjection>('blueprints')

    const errors: Error[] = []

    const query = !isDebug
        ? QUERIES.pendingPraise
        : {$or: [
            // For debug, use storybook ships.
            // tslint:disable-next-line: no-duplicate-string
            {'steam.title': {$regex: '^Cursor$'}},
            // {'steam.title': {$regex: '\\[NO MODS\\] Wyvern - Atmospheric Survival Ship'}},
            // {'steam.title': {$regex: 'IMDC A-1 \'Aegir\' Fighter'}},
            // {'steam.title': {$regex: 'IMDC A-2 \'Aegir\' Fighter'}},
        ]}

    const docsAll = await collection
        .find(query)
        .project({
            '_id': true,
            'steam.revision': true,
        })
        .toArray()
    console.info(`Required ${docsAll.length} blueprints.`)

    const docsCached = docsAll
        .filter((doc) => {
            try {
                lstatSync(sbcPath(doc))

                return true  // If exists, skip download.
            } catch(err) {
                return false
            }
        })
    console.info(`But not yet cached are ${docsAll.length - docsCached.length} blueprints.`)

    const docs = docsCached
        // .filter((doc) => lstatSync(sbcPath(doc)).size < 2 * 1024 * 1024)
    // console.info(`But too large (>2MB) are ${docsCached.length - docs.length} blueprints.`)

    console.info(`Praising ${docs.length} blueprints...`)
    await Promise.all([...docs.entries()].map(async ([index, doc]) => {
        const prefix = `#${pad(String(index), 5)} | ${pad(String(doc._id), 10)} |  ${(farmOptions.maxCallTime / 1000).toFixed(0)}s |`
        try {
            await queueWork(index, doc)
            praised.set(doc._id, null)
        } catch(err) {
            if(err.type === 'TimeoutError') console.warn(prefix, 'Error:', err.type)
            praised.set(doc._id, err.type)
            try {
                await collection.updateOne({ _id: doc._id }, { $set: {sbc: {_error: IBlueprint.VERSION.sbc, _errorDetails: err.type}}})
            } catch(err) {
                console.error(prefix, `Error while setting error: ${err.message.replace(/\n/g, '|')}`)
                process.exit(1)
            }
        }
    }))

    const timeoutErrors = [...praised.values()].reduce((sum, val) => sum + (val === 'TimeoutError' ? 1 : 0), 0)
    const readErrors    = [...praised.values()].reduce((sum, val) => sum + (val === 'read' ? 1 : 0), 0)
    const praiseErrors  = [...praised.values()].reduce((sum, val) => sum + (val === 'praise' ? 1 : 0), 0)
    const updateErrors  = [...praised.values()].reduce((sum, val) => sum + (val === 'update' ? 1 : 0), 0)
    const succeeded     = [...praised.values()].reduce((sum, val) => sum + (val === null ? 1 : 0), 0)
    console.info(`Errors (${errors.length}):`, errors)
    console.info(`Results: ${succeeded} succeeded, but ${timeoutErrors} timeouted, ${readErrors} unread, ${praiseErrors} unpraised, ${updateErrors} not updated.`)
    console.info(`Praise finished in ${toMinSec((Date.now() - timer) / 1000)}.`)

    await client.close()
    process.exitCode = 0
    workerFarm.end(workers)


}
