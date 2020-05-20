import { DB_NAME, DB_URL, IBlueprint } from '@sepraisal/common'
import { unzipCachedSbc } from '@sepraisal/praisal'
import { NewPraisalManager } from '@sepraisal/praisal/lib/NewPraisalManager'
import { readFileSync } from 'fs'
import { Collection, MongoClient } from 'mongodb'
import pad from 'pad'

import { sbcPath } from '../utils'

// tslint:disable: no-submodule-imports

interface IProjection {
    _id: number,
    steam: {
        revision: number,
    },
}


// tslint:disable-next-line: no-unused - TODO: this is bug.
let collection: Collection<IProjection>


const init = (async () => {
    const sePraisal = NewPraisalManager()()
    const client = await MongoClient.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    // console.info(`Database connection established (fork ${process.pid}).`)
    const db = client.db(DB_NAME)
    collection = db.collection<IProjection>('blueprints')
    return sePraisal
})()

export = async (index: number, doc: IProjection, callback: (err: Error | void) => unknown) => {
    const sePraisal = await init
    const timer = Date.now()

    const prefix = () => [
        `#${pad(String(index), 5)}`,
        `|`,
        `${pad(String(doc._id), 10)}`,
        `|`,
        pad(5, `${((Date.now() - timer) / 1000).toFixed(1)}s`),
        `|`,
    ].join(' ')

    let xml: string
    try {
        xml = await unzipCachedSbc(readFileSync(sbcPath(doc)))
    } catch(err) {
        err.type = 'read'
        console.warn(prefix(), `Reading Error: failed to open archive: ${err.message}`)

        return callback(err as Error)
    }

    let sbc: IBlueprint.ISbc
    try {
        const praisal = await sePraisal.praiseSbc(xml)
        sbc = praisal.toBlueprintSbc(doc.steam.revision)
    } catch(err) {
        err.type = 'praise'
        console.error(prefix(), `Praisal Error: ${err.message.replace(/\n/g, '|')}`)

        return callback(err)
    }

    try {
        await collection.updateOne({ _id: doc._id }, { $set: {sbc}})
    } catch(err) {
        err.type = 'update'
        console.error(prefix(), `Update Error: ${err.message.replace(/\n/g, '|')}`)

        return callback(err)
    }

    console.info(
        prefix(),
        pad(6, String(sbc.blockCount)),
        sbc.gridSize === 'Small' ? 'SG' : 'LG',
        `|`,
        `${sbc.gridTitle}`,
    )
    // console.info(JSON.stringify(sbc))
    callback(undefined)
}
