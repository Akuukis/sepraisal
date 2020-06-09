import { DB_NAME, DB_URL, IBlueprint, toMinSec } from '@sepraisal/common'
import { lstatSync } from 'fs'
import moment from 'moment'
import { FilterQuery, MongoClient } from 'mongodb'
import { cpus } from 'os'
import pad from 'pad'
import workerFarm from 'worker-farm'

import { QUERIES } from '../queries'
import { prepareQuery, sbcPath } from '../utils'


interface IProjection {
    _id: number,
    steam: {
        revision: number,
    },
}

const TIMEOUT_PARALLEL = 10
const TIMEOUT_SERIAL = 600

const isDebug = process.argv.some((arg) => arg.includes('--debug'))
const isSerial = process.argv.some((arg) => arg.includes('--serial'))
const farmOptions = {
    workerOptions               : {
        stdio: 'ignore' as const,  // It doesn't print anything anyways, and this would hide "JavaScript heap out of memory" too,
        ...(isDebug ? {execArgv: ['--inspect-brk=49999']} : {}),
        execArgv: ['--expose-gc', ...process.execArgv],
        env: {
            ...process.env,
            ...(isSerial ? {NODE_OPTIONS: "--max-old-space-size=3072"} : {}),  // My server can't handle more.
        }
    },
    maxCallsPerWorker           : isSerial ? 1 : Infinity,  // THIS makes sure that dying worker doesn't pull another job along it.
    maxConcurrentWorkers        : (isDebug || isSerial) ? 1 : cpus().length,
    maxConcurrentCallsPerWorker : 1,
    maxConcurrentCalls          : Infinity,
    maxCallTime                 : isDebug ? Infinity : (isSerial ? TIMEOUT_SERIAL : TIMEOUT_PARALLEL) * 1000,
    maxRetries                  : 0,  // Don't retry, that messes up logic for cases when child is out-of-error.
    autoStart                   : false,
}
const workers = workerFarm(farmOptions, require.resolve(`./5-praiseWorker.${__filename.slice(-2)}`))
const queueWork = async (index: number, doc: IProjection) => new Promise<string>(
        (resolve, reject) => workers(index, doc, (err: Error | null, msg?: string) => err ? reject(err) : resolve(msg)),
    )


type IJobResult = 'ProcessTerminatedError' | 'TimeoutError' | 'read' | 'praise' | 'update' | null
const praised = new Map<number, IJobResult>()


export const main = async (): Promise<void> => {
    if(isDebug) console.info('Debugging on.')
    console.info('Mode:', isSerial ? 'serial' : 'parallel')

    const timer = Date.now()
    const client = await MongoClient.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    console.info(`Database connection established (master).`)
    const db = client.db(DB_NAME)
    const collection = db.collection<IProjection>('blueprints')

    const errors: Error[] = []

    let query: FilterQuery<IProjection> = prepareQuery<IProjection>(QUERIES.pendingPraise)
    if(isDebug) {
        query = {$or: [
            // For debug, use storybook ships.
            {'steam.title': {$regex: '^Cursor$'}},
            // {'steam.title': {$regex: '\\[NO MODS\\] Wyvern - Atmospheric Survival Ship'}},
            // {'steam.title': {$regex: 'IMDC A-1 \'Aegir\' Fighter'}},
            // {'steam.title': {$regex: 'IMDC A-2 \'Aegir\' Fighter'}},
        ]}
    // } else if (isSerial) {
    //     query = {$or: [
    //         {'sbc._errorDetails': 'ProcessTerminatedError'},  // Crashed out-of-memory.
    //         {'sbc._errorDetails': 'TimeoutError'},  // Exceeded timeout.
    //     ]}
    }

    const docsAll = await collection
        .find(query)
        .project({
            '_id': true,
            'steam.revision': true,
        })
        .toArray()
    console.info(`Required ${docsAll.length} blueprints.`)

    const docs = docsAll
        .filter((doc) => {
            try {
                lstatSync(sbcPath(doc))

                return true  // If exists, skip download.
            } catch(err) {
                return false
            }
        })
    console.info(`But not yet cached are ${docsAll.length - docs.length} blueprints.`)

    console.info(`Praising ${docs.length} blueprints...`)
    await Promise.all([...docs.entries()].map(async ([index, doc]) => {
        const timer = Date.now()
        const prefix = () => `${moment().toISOString()} | #${pad(String(index), 5)} | ${pad(String(doc._id), 10)} |`
        try {
            console.info(prefix(), await queueWork(index, doc))
            praised.set(doc._id, null)
        } catch(err) {
            if(['read', 'praise', 'update'].includes(err.type)) {
                console.error(prefix(), (err as Error).message)
            } else if(err.type === 'TimeoutError') {
                console.error(
                    prefix(),
                    pad(13, `${(farmOptions.maxCallTime / 1000).toFixed(0)}s`),
                    `|`,
                    `${(err as Error).name}:`,
                    `${(err as Error).message}`,
                )
            } else {
                console.error(
                    prefix(),
                    pad(12, `${((Date.now() - timer) / 1000).toFixed(1)}s`),
                    `|`,
                    `${(err as Error).name}:`,
                    `${(err as Error).message}`,
                )
            }
            praised.set(doc._id, err.type || err.name || 'UnknownError')

            if(!isSerial) return  // Don't tag as errored for parallel runs. Tag errors only if serial can't deal with it.

            try {
                await collection.updateOne({ _id: doc._id }, { $set: {sbc: {_error: IBlueprint.VERSION.sbc, _errorDetails: err.type}}})
            } catch(err) {
                console.error(prefix(), `Error while setting error: ${err.message.replace(/\n/g, '|')}`)
                process.exit(1)
            }
        }
    }))

    const timeoutErrors     = [...praised.values()].reduce((sum, val) => sum + (val === 'TimeoutError' ? 1 : 0), 0)
    const readErrors        = [...praised.values()].reduce((sum, val) => sum + (val === 'read' ? 1 : 0), 0)
    const terminatedErrors  = [...praised.values()].reduce((sum, val) => sum + (val === 'ProcessTerminatedError' ? 1 : 0), 0)
    const praiseErrors      = [...praised.values()].reduce((sum, val) => sum + (val === 'praise' ? 1 : 0), 0)
    const updateErrors      = [...praised.values()].reduce((sum, val) => sum + (val === 'update' ? 1 : 0), 0)
    const succeeded         = [...praised.values()].reduce((sum, val) => sum + (val === null ? 1 : 0), 0)
    console.info(`Errors (${errors.length}):`, errors)
    console.info(`Results:`, [``,
        `- ${succeeded} succeeded`,
        `- ${timeoutErrors} timeouted`,
        `- ${readErrors} unread`,
        `- ${terminatedErrors} run out-of-memory`,
        `- ${praiseErrors} unpraised`,
        `- ${updateErrors} not updated`,
    ].join('\n'))
    console.info(`Praise finished in ${toMinSec((Date.now() - timer) / 1000)}.`)

    await client.close()
    process.exitCode = 0
    workerFarm.end(workers)


}
