import { BLOCK_GROUPS } from '@sepraisal/common'
import { createReadStream, readFileSync } from 'fs'
import { join } from 'path'

import { PraisalManager } from '../src'
import { parseSteamArchive } from '../src/parseSteamArchive'


// tslint:disable: no-duplicate-string
const VENDOR_DIR = join(__dirname, '..', 'vendor')
const FIXTURES_DIR = join(__dirname, 'fixtures')


let sepraisal: PraisalManager
beforeEach(async () => {
    sepraisal = new PraisalManager()
    const cubeBlocksXml = readFileSync(join(VENDOR_DIR, 'CubeBlocks.sbc')).toString()
    const componentsXml = readFileSync(join(VENDOR_DIR, 'Components.sbc')).toString()
    const materialsXml = readFileSync(join(VENDOR_DIR, 'Blueprints.sbc')).toString()
    const physicalItemsXml = readFileSync(join(VENDOR_DIR, 'PhysicalItems.sbc')).toString()
    await sepraisal.addOres(physicalItemsXml)
    await sepraisal.addIngots(physicalItemsXml, materialsXml)
    await sepraisal.addComponents(materialsXml, componentsXml)
    await sepraisal.addCubes(cubeBlocksXml)
    sepraisal.addGroups(BLOCK_GROUPS)
})

describe('PraisalManager.praiseXml', () => {
    test('should succeed to praise random small steam blueprint (Wyvern - Atmospheric Survival Ship)', async () => {
        const archive = await parseSteamArchive(createReadStream(join(FIXTURES_DIR, '659278800.1.zip')))
        const praisal = await sepraisal.praiseXml(archive.blueprint)
    })
})
