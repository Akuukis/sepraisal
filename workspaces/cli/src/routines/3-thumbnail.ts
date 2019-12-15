// tslint:disable:no-unsafe-any - because `response` is not typed.
// tslint:disable:object-literal-sort-keys member-ordering max-line-length
import { DB_NAME, DB_URL, IBlueprint, toMinSec, Work, Worker } from '@sepraisal/common'
import { Collection, MongoClient } from 'mongodb'
import * as pad from 'pad'
import { join } from 'path'

import { QUERIES } from '../queries'
import { execAsync, execAsyncBuffer, lstatAsync, THUMB_DIR } from '../utils'


const QUALITY = 10000  // In bytes. 3000 is the lowest that doesn't make eyes bleed.


interface IProjection {
    _id: number,
    steam: {_thumbName: string | null},
}

const thumbnailed = new Map<number, number>()
let column = 0
const timer = Date.now()

const output = (char: string) => {
    process.stdout.write(char)
    column = column + 1

    if(column >= 100) {
        column = 0
        const downloaded = ([...thumbnailed.values()].reduce((sum, val) => sum + val, 0) / 1000000).toFixed(1)
        process.stdout.write(` ${toMinSec((Date.now() - timer) / 1000)} (${downloaded} MB)\n`)
        process.stdout.write(`${pad(5, String(thumbnailed.size))}: `)
    }
}

export const thumbConvert = async (idPair: string) => {
    if(idPair.includes('steam_workshop_default_image')) return null
    const safeFilename = join(THUMB_DIR, `${idPair.replace('/', '_')}.jpg`)

    if(!await lstatAsync(safeFilename)) {
        const link = [
                `https://steamuserimages-a.akamaihd.net/ugc`,
                ...idPair.split('-'),
                `?imw=268&imh=151&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true`,
            ].join('/')
        await execAsync(`curl -s '${link}' -o '${safeFilename}'`)
    }

    return execAsyncBuffer(`cat ${safeFilename} | cwebp -preset default -resize 268 151 -pass 10 -mt -af -size ${QUALITY} -quiet -o - -- -`)
}

type IWorkItem = [Collection, IProjection, number]
const work: Work<IWorkItem> = async (collection: Collection, doc: IProjection, index: number): Promise<void> => {

    let webp: Buffer | null
    if(doc.steam._thumbName === null) {
        webp = null
    } else {
        try {
            webp = await thumbConvert(doc.steam._thumbName)
            if(webp === null) throw new Error()
        } catch(err) {
            process.stderr.write(`${err}\n`)
            process.stdout.write(`?`)

            return
        }
    }

    try {
        await collection.updateOne({ _id: doc._id }, { $set: {
            thumb: {
                webp,
                _revision: doc.steam._thumbName,
                _version: IBlueprint.VERSION.thumb,
            },
        }})
        output('.')
        thumbnailed.set(doc._id, webp ? webp.length : 0)
    } catch(err) {
        process.stderr.write(`${err}\n`)
        process.stdout.write(`!`)
    }
}


export const main = async () => {


    const client = await MongoClient.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    console.info('Successfully connected to server.')
    const db = client.db(DB_NAME)
    const collection = db.collection<IProjection>('blueprints')

    const works: IWorkItem[] = []
    const errors: Error[] = []

    const docs = await collection
        .find(QUERIES.pendingThumb)
        .project({
            '_id': true,
            'steam._thumbName': true,
        })
        .limit(999999)
        .toArray()
    console.info(`Downloading thumbnails for ${docs.length} blueprints...`)

    for(const [i, doc] of docs.entries()) {
        works.push([collection, doc, i])
    }

    const worker = Worker<IWorkItem>(work, errors)

    await Promise.all([
        worker(works, 0),
        worker(works, 1),
        worker(works, 2),
        worker(works, 3),
    ])

    console.info(`Errors (${errors.length}):`, errors)
    console.info(`Results: ${thumbnailed.size} total: ${docs.length}.`)
    console.info(`Thumb finished in ${toMinSec((Date.now() - timer) / 1000)}.`)

    await client.close()


}
