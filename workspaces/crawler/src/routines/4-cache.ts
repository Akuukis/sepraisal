import { DB_NAME, DB_URL, toMinSec, Work, Worker } from '@sepraisal/common'
import { exec, execSync } from 'child_process'
import { lstatSync, readdirSync } from 'fs'
import { MongoClient } from 'mongodb'
import pad from 'pad'
import { join } from 'path'
import { Tail } from 'tail'

import { QUERIES } from '../queries'
import { asCrawlerUser, mkdirpSync, prepareQuery, sbcPath, STEAM_DIR, STEAM_USERNAME } from '../utils'

const BATCH_SIZE = 50
const MAX_SIZE = Number.MAX_SAFE_INTEGER  // No limit.

const steamLogFile = join(STEAM_DIR, 'logs', 'workshop_log.txt')
const steamAppsDir = execSync(`ls -1 ${STEAM_DIR}`).toString()
    .split('\n')
    .concat('SteamApps')
    .find((folder) => folder.toLowerCase() === 'steamapps')
if(!steamAppsDir) throw new Error(`Steam directory "${STEAM_DIR}" doesn't contain subdirectory 'steamapps' in either lower or upper case.`)
const steamDownloadsDir = join(STEAM_DIR, steamAppsDir, 'workshop', 'content', '244850')

const normalizeName = (blueprintDir: string, name: string) => {
    if(readdirSync(blueprintDir).includes(name)) {
        execSync(asCrawlerUser(`(cd ${blueprintDir} && mv ${name} bp.sbc)`))
    }
}

/**
* Normalize various steam workshop item formats into a unified "SEPraisal Cache" format.
*
* "SEPraisal Cache" is a zip archive with only one file inside that contains an unmodified blueprint, called `bp.sbc`.
*
*/
const fromSteamtoCache = (doc: IProjection) => {
    const blueprintDir = join(steamDownloadsDir, String(doc._id))

    const cacheFilename = sbcPath(doc)
    mkdirpSync(cacheFilename)

    // Old steam mod format had archive, now they don't but are (de)compressed transparently.
    if(readdirSync(blueprintDir).some((filename) => filename.includes('_legacy.bin'))) {
        execSync(asCrawlerUser(`(cd ${blueprintDir} && unzip -o *_legacy.bin)`))
    }

    // Normalize naming, if needed.
    normalizeName(blueprintDir, 'BP.sbc')  // Quite popular, perhaps from Windows machines.
    normalizeName(blueprintDir, 'p.sbc')  // 9 cases total.
    normalizeName(blueprintDir, '.sbc')  // 3 cases total.
    normalizeName(blueprintDir, 'sbc')  // 1 case total.

    const contents = readdirSync(blueprintDir)
    if(contents.includes('bp.sbc')) {
        execSync(`(cd ${blueprintDir} && zip ${cacheFilename} bp.sbc)`)
    } else {
        throw new Error(`Unrecognized mod contents: ${contents.join(', ')}`)
    }
    execSync(asCrawlerUser(`rm -rf ${blueprintDir}`))
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

    // Cleanup Steam cache otherwise it slows down 5x already after 500 downloads.
    execSync(asCrawlerUser(`rm -rf ${join(STEAM_DIR, 'userdata', '*', 'ugc', 'consumed.vdf')}`))
    execSync(asCrawlerUser(`rm -rf ${join(STEAM_DIR, steamAppsDir, 'workshop', 'appworkshop_244850.acf')}`))

    const steamcmdQuery = docs.reduce((query, bufferedDoc) => `${query} +workshop_download_item 244850 ${bufferedDoc._id}`, '')

    // In first run, logfile may not exist.
    if(mkdirpSync(steamLogFile)) execSync(asCrawlerUser(`touch ${steamLogFile}`))
    const tail = new Tail(steamLogFile)

    process.stdout.write(`${(new Date()).toISOString()} #${pad(String(index), 4)} x${docs.length}: `)
    const start = Date.now()
    await Promise.all<unknown>([
        new Promise<void>((resolve, reject) => {
            exec(
                asCrawlerUser(`steamcmd +login ${STEAM_USERNAME} ${steamcmdQuery} validate +exit`),
                {maxBuffer: Infinity},
                (err) => err ? reject(err) : resolve(),
            )
        }),
        new Promise<void>((resolve) => {
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
                    process.stderr.write(`${(new Date()).toISOString()} Matched an ID ${match[1]} but got error: ${err}\n`)
                }

                remaining = remaining - 1
                if(remaining === 0) resolve()
            })
            // Sometimes something happens and 1 out of batch isn't noticed and that hangs the whole process.
            // Set a timeout at lower bound of average time it takes for the batch (5sec each).
            setTimeout(resolve, BATCH_SIZE * 5)
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


export const main = async (): Promise<void> => {


    const timer = Date.now()
    const client = await MongoClient.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    console.info('Successfully connected to server.')
    const db = client.db(DB_NAME)
    const collection = db.collection<IProjection>('blueprints')

    const works: IWorkItem[] = []
    const errors: Error[] = []

    const docsAll = await collection
        .find(prepareQuery<IProjection>(QUERIES.pendingPraise))
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
                lstatSync(join(steamDownloadsDir, String(doc._id)))
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

    const docs = docsNew.filter((doc) => doc.steam.sizeMB < MAX_SIZE)
    console.info(`But too big (>${MAX_SIZE}MB) are ${docsNew.length - docs.length} blueprints.`)

    console.info('Checking passwords...')
    execSync(asCrawlerUser(`steamcmd +login ${STEAM_USERNAME} +exit`), {stdio: 'inherit'})

    console.info(`Caching ${docs.length} blueprints...`)

    const batches = Array(Math.ceil(docs.length / BATCH_SIZE))
        .fill(null)
        .map((_, i) => docs.slice(i * BATCH_SIZE, (i + 1) * BATCH_SIZE))

    for(const [i, batch] of batches.entries()) {
        works.push([i, batch])
    }

    const worker = Worker<IWorkItem>(work, errors)
    await worker(works, 0)

    const duration = (Date.now() - timer) / 1000
    console.info(`Finished in ${toMinSec(duration)}.`)
    console.info(`Errors (${errors.length}):`, errors)

    await client.close()
    process.exitCode = 0
    process.exit()


}
