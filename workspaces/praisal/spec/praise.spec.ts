import { BLOCK_GROUPS } from '@sepraisal/common'
import { readFileSync } from 'fs'
import { join } from 'path'

import { PraisalManager } from '../src'


// tslint:disable: no-duplicate-string
const VENDOR_DIR = join(__dirname, '..', 'vendor')
const PREFABS_DIR = join(VENDOR_DIR, 'prefabs')
const MY_BLUEPRINTS_DIR = join(VENDOR_DIR, 'myBlueprints')


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
    test('should succeed to praise AtmosphericLander', async () => {
        const praisal = await sepraisal.praiseXml(readFileSync(join(PREFABS_DIR, 'AtmosphericLander.sbc'), 'utf-8'))
    })
    test('should succeed to praise RespawnShip', async () => {
        const praisal = await sepraisal.praiseXml(readFileSync(join(PREFABS_DIR, 'RespawnShip.sbc'), 'utf-8'))
    })
    test('should succeed to praise dekartaTests', async () => {
        const praisal = await sepraisal.praiseXml(readFileSync(join(MY_BLUEPRINTS_DIR, 'dekartaTests.sbc'), 'utf-8'))
    })
    test('should succeed to praise EveryLargeBlockOnce', async () => {
        const praisal = await sepraisal.praiseXml(readFileSync(join(MY_BLUEPRINTS_DIR, 'EveryLargeBlockOnce.sbc'), 'utf-8'))
    })
})
