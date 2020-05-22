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

export = async (index: number, doc: IProjection, callback: (err: Error | null, msg?: string) => unknown) => {
    const timer = Date.now()
    const sePraisal = await init
    const loaded = (Date.now() - timer) / 1000

    const prefix = () => [
        pad(5, `${loaded.toFixed(1)}s`),
        `|`,
        pad(5, `${((Date.now() - timer) / 1000 - loaded).toFixed(1)}s`),
        `|`,
    ].join(' ')

    let xml: string
    try {
        xml = await unzipCachedSbc(readFileSync(sbcPath(doc)))
    } catch(err) {
        err.type = 'read'
        err.name = `ReadingError`
        err.message = `${prefix()} ReadingError: failed to open archive: ${err.message}`

        return callback(err as Error)
    }

    let sbc: IBlueprint.ISbc
    try {
        const praisal = await sePraisal.praiseSbc(xml)
        sbc = praisal.toBlueprintSbc(doc.steam.revision)
    } catch(err) {
        err.type = 'praise'
        err.name = `PraisalError`
        err.message = `${prefix()} PraisalError: ${err.message.replace(/\n/g, '|')}`

        return callback(err as Error)
    }

    try {
        await collection.updateOne({ _id: doc._id }, { $set: {sbc}})
    } catch(err) {
        err.type = 'update'
        err.name = `UpdateError`
        err.message = `${prefix()} UpdateError: ${err.message.replace(/\n/g, '|')}`

        return callback(err as Error)
    }

    const msg = [
        prefix(),
        pad(6, String(sbc.blockCount)),
        sbc.gridSize === 'Small' ? 'SG' : 'LG',
        `|`,
        `${sbc.gridTitle}`,
    ].join(' ')
    // console.info(JSON.stringify(sbc))
    callback(null, msg)
}
