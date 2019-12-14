// tslint:disable: no-submodule-imports
import { BLOCK_GROUPS, DB_NAME, DB_URL, IBlueprint } from '@sepraisal/common'
import { PraisalManager } from '@sepraisal/praisal'
import { parseSteamArchive } from '@sepraisal/praisal/lib/parseSteamArchive'
import { createReadStream, readFileSync } from 'fs'
import { Collection, MongoClient } from 'mongodb'
import * as pad from 'pad'
import { join } from 'path'

import { sbcPath } from '../utils'


interface IProjection {
    _id: number,
    steam: {
        revision: number,
    },
}


const VENDOR_DIR = join(require.resolve('@sepraisal/praisal'), '..', '..', 'vendor')
const sePraisal = new PraisalManager()
// tslint:disable-next-line: no-unused - TODO: this is bug.
let collection: Collection<IProjection>


const init = (async () => {
    const componentsXml = readFileSync(join(VENDOR_DIR, 'Components.sbc')).toString()
    const materialsXml = readFileSync(join(VENDOR_DIR, 'Blueprints.sbc')).toString()
    const physicalItemsXml = readFileSync(join(VENDOR_DIR, 'PhysicalItems.sbc')).toString()
    const cubeBlocksXmls = [
        readFileSync(join(VENDOR_DIR, 'CubeBlocks', 'CubeBlocks.sbc')).toString(),
        readFileSync(join(VENDOR_DIR, 'CubeBlocks', 'CubeBlocks_Armor.sbc')).toString(),
        readFileSync(join(VENDOR_DIR, 'CubeBlocks', 'CubeBlocks_Automation.sbc')).toString(),
        readFileSync(join(VENDOR_DIR, 'CubeBlocks', 'CubeBlocks_Communications.sbc')).toString(),
        readFileSync(join(VENDOR_DIR, 'CubeBlocks', 'CubeBlocks_Control.sbc')).toString(),
        readFileSync(join(VENDOR_DIR, 'CubeBlocks', 'CubeBlocks_DecorativePack.sbc')).toString(),
        readFileSync(join(VENDOR_DIR, 'CubeBlocks', 'CubeBlocks_DecorativePack2.sbc')).toString(),
        readFileSync(join(VENDOR_DIR, 'CubeBlocks', 'CubeBlocks_Doors.sbc')).toString(),
        readFileSync(join(VENDOR_DIR, 'CubeBlocks', 'CubeBlocks_Economy.sbc')).toString(),
        readFileSync(join(VENDOR_DIR, 'CubeBlocks', 'CubeBlocks_Energy.sbc')).toString(),
        readFileSync(join(VENDOR_DIR, 'CubeBlocks', 'CubeBlocks_Extras.sbc')).toString(),
        readFileSync(join(VENDOR_DIR, 'CubeBlocks', 'CubeBlocks_Gravity.sbc')).toString(),
        readFileSync(join(VENDOR_DIR, 'CubeBlocks', 'CubeBlocks_Interiors.sbc')).toString(),
        readFileSync(join(VENDOR_DIR, 'CubeBlocks', 'CubeBlocks_LCDPanels.sbc')).toString(),
        readFileSync(join(VENDOR_DIR, 'CubeBlocks', 'CubeBlocks_Lights.sbc')).toString(),
        readFileSync(join(VENDOR_DIR, 'CubeBlocks', 'CubeBlocks_Logistics.sbc')).toString(),
        readFileSync(join(VENDOR_DIR, 'CubeBlocks', 'CubeBlocks_Mechanical.sbc')).toString(),
        readFileSync(join(VENDOR_DIR, 'CubeBlocks', 'CubeBlocks_Medical.sbc')).toString(),
        readFileSync(join(VENDOR_DIR, 'CubeBlocks', 'CubeBlocks_Production.sbc')).toString(),
        readFileSync(join(VENDOR_DIR, 'CubeBlocks', 'CubeBlocks_Thrusters.sbc')).toString(),
        readFileSync(join(VENDOR_DIR, 'CubeBlocks', 'CubeBlocks_Tools.sbc')).toString(),
        readFileSync(join(VENDOR_DIR, 'CubeBlocks', 'CubeBlocks_Utility.sbc')).toString(),
        readFileSync(join(VENDOR_DIR, 'CubeBlocks', 'CubeBlocks_Weapons.sbc')).toString(),
        readFileSync(join(VENDOR_DIR, 'CubeBlocks', 'CubeBlocks_Wheels.sbc')).toString(),
        readFileSync(join(VENDOR_DIR, 'CubeBlocks', 'CubeBlocks_Windows.sbc')).toString(),
    ]
    await sePraisal.addOres(physicalItemsXml)
    await sePraisal.addIngots(physicalItemsXml, materialsXml)
    await sePraisal.addComponents(materialsXml, componentsXml)
    for(const cubeBlocksXml of cubeBlocksXmls) await sePraisal.addCubes(cubeBlocksXml)
    sePraisal.addGroups(BLOCK_GROUPS)
    const client = await MongoClient.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    // console.info(`Database connection established (fork ${process.pid}).`)
    const db = client.db(DB_NAME)
    collection = db.collection<IProjection>('blueprints')

})()

export = async (index: number, doc: IProjection, callback: (err: Error | void) => unknown) => {
    await init
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
        xml = await parseSteamArchive(createReadStream(sbcPath(doc)))
    } catch(err) {
        err.type = 'read'
        console.warn(prefix(), `Reading Error: failed to open archive: ${err.message}`)

        return callback(err as Error)
    }

    let sbc: IBlueprint.ISbc
    try {
        const praisal = await sePraisal.praiseXml(xml)
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
