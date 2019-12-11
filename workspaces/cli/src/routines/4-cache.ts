// tslint:disable:no-unsafe-any - because `response` is not typed.
// tslint:disable:object-literal-sort-keys member-ordering max-line-length
import { DB_NAME, DB_URL, toMinSec, Work, Worker } from '@sepraisal/common'
import { exec, execSync } from 'child_process'
import { lstatSync, readdirSync } from 'fs'
import { MongoClient } from 'mongodb'
import * as pad from 'pad'
import { join } from 'path'
import { Tail } from 'tail'

import { QUERIES } from '../queries'
import { sbcPath, STEAM_DIR, STEAM_USERNAME } from '../utils'

const BATCH_SIZE = 100
const STEAM_LOG = join('/', 'home', 'steam', '.steam', 'logs', 'workshop_log.txt')

const asSteam = (cmd: string) => {
    const username = execSync(`whoami`).toString().trim()

    return username === 'steam' ? cmd : `sudo su steam -c '${cmd}'`
}
const fromSteamtoCache = (doc: IProjection) => {
    const blueprintDir = join(STEAM_DIR, String(doc._id))
    const cacheFile = sbcPath(doc)
    const contents = readdirSync(blueprintDir)
    if(contents.some((filename) => filename.includes('_legacy.bin'))) {
        execSync(`cp ${blueprintDir}/*_legacy.bin ${cacheFile}`)
        execSync(asSteam(`rm -rf ${blueprintDir}`))
    } else if(contents.includes('bp.sbc')) {
        execSync(`zip ${cacheFile} ${blueprintDir}/bp.sbc`)
        execSync(asSteam(`rm -rf ${blueprintDir}`))
    } else {
        throw new Error(`Unrecognized mod contents: ${contents.join(', ')}`)
    }
}

interface IProjection {
    _id: number,
    steam: {
        revision: number,
        sizeMB: number,
    },
}

type IWorkItem = [number, IProjection[]]

const work: Work<IWorkItem> = async (index: number, docs: IProjection[]) => {

    const steamcmdQuery = docs.reduce((query, bufferedDoc) => `${query} +workshop_download_item 244850 ${bufferedDoc._id}`, '')
    const tail = new Tail(STEAM_LOG)

    process.stdout.write(`#${pad(String(index), 4)} x${docs.length}: `)
    const start = Date.now()
    await Promise.all<unknown>([
        new Promise<void>((resolve, reject) => {
            exec(
                asSteam(`steamcmd +login ${STEAM_USERNAME} ${steamcmdQuery} validate +exit`),
                {maxBuffer: Infinity},
                (err) => err ? reject(err) : resolve(),  // tslint:disable-line:no-void-expression
            )
        }),
        new Promise<void>((resolve, reject) => {
            let remaining = docs.length
            tail.on('line', (line: string) => {
                const match = line.match(/Download item (\d+) result : (.*)/)
                if(match === null) return

                try {
                    if(match[2] !== 'OK') throw new Error(`Not OK but "${match[2]}"`)
                    const theDoc = docs.find((doc) => doc._id === Number(match[1]))
                    if(!theDoc) throw new Error('Not found ID')
                    fromSteamtoCache(theDoc)
                    process.stdout.write(`.`)
                } catch(err) {
                    process.stdout.write(`!`)
                    process.stderr.write(`Matched an ID ${match[1]} but got error: ${err}\n`)
                }

                remaining = remaining - 1
                if(remaining === 0) resolve()
            })
        }),
    ])

    tail.unwatch()
    const end = Date.now()
    const elapsed = (end - start) / 1000
    const size = docs.reduce((sum, doc) => sum + doc.steam.sizeMB, 0)

    const timingAbsolute = `${pad(4, size.toFixed(2))}MB in ${pad(6, toMinSec(elapsed))}`
    const timingRelative = `${pad(4, (size / elapsed * 1000).toFixed(0))}KB/sec`
    process.stdout.write(` (${timingAbsolute}, ${timingRelative})\n`)
}


export const main = async () => {


    const timer = Date.now()
    const client = await MongoClient.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    console.info('Successfully connected to server.')
    const db = client.db(DB_NAME)
    const collection = db.collection<IProjection>('blueprints')

    const works: IWorkItem[] = []
    const errors: Error[] = []

    const docsAll = await collection
        .find(QUERIES.pendingPraise)
        .project({
            '_id': true,
            'steam.revision': true,
            'steam.sizeMB': true,
        })
        .limit(99999)
        .toArray()
    console.info(`Required ${docsAll.length} blueprints.`)


    const docsNew = docsAll
        .filter((doc) => {
            try {
                lstatSync(join(STEAM_DIR, String(doc._id)))
                fromSteamtoCache(doc)
                console.info(`Moved ${doc._id} from steam to cache.`)
            } catch (err) {
                // Skip.
            }

            try {
                lstatSync(sbcPath(doc))

                return false  // If exists, skip download.
            } catch(err) {
                return true
            }
        })
    console.info(`But already cached are ${docsAll.length - docsNew.length} blueprints.`)

    const docs = docsNew.filter((doc) => doc.steam.sizeMB < 5)
    console.info(`But too big (>5MB) are ${docsNew.length - docs.length} blueprints.`)

    console.info('Checking passwords...')
    execSync(asSteam(`steamcmd +login ${STEAM_USERNAME} +exit`), {stdio: 'inherit'})

    console.info(`Caching ${docs.length} blueprints...`)

    const batches = Array(Math.ceil(docs.length / BATCH_SIZE))
        .fill(null)
        .map((_, i) => docs.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE))

    for(const [i, batch] of batches.entries()) {
        works.push([i, batch])
    }

    const worker = Worker<IWorkItem>(work, errors)

    await Promise.all([
        worker(works, 0),
    ])

    const duration = (Date.now() - timer) / 1000
    console.info(`Finished in ${toMinSec(duration)}.`)
    console.info(`Errors (${errors.length}):`, errors)

    await client.close()
    process.exitCode = 0
    process.exit()


}
