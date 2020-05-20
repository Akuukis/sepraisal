import { VENDOR_MOD } from '@sepraisal/common/src'
import { readFileSync } from 'fs'
import { join } from 'path'

import { PraisalManager } from '../src'


// tslint:disable: no-duplicate-string
const VENDOR_DIR = join(__dirname, '..', 'vendor')

const physicalItemsSbcVanilla = readFileSync(join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'PhysicalItems.sbc')).toString()
const materialsSbcVanilla = readFileSync(join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'Blueprints.sbc')).toString()
const componentsSbcVanilla = readFileSync(join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'Components.sbc')).toString()
const physicalItemsSbcEconomy = readFileSync(join(VENDOR_DIR, VENDOR_MOD.ECONOMY, 'PhysicalItems.sbc')).toString()
const materialsSbcEconomy = readFileSync(join(VENDOR_DIR, VENDOR_MOD.ECONOMY, 'Blueprints.sbc')).toString()
const componentsSbcEconomy = readFileSync(join(VENDOR_DIR, VENDOR_MOD.ECONOMY, 'Components.sbc')).toString()

let sepraisal: PraisalManager

const testMaterials = () => {
    test('should build all ores', async () => {
        expect(sepraisal.ores.size).toMatchSnapshot()
        expect([...sepraisal.ores.keys()]).toMatchSnapshot()
        expect([...sepraisal.ores.values()]).toMatchSnapshot()
    })
    test('should build all ingots', async () => {
        expect(sepraisal.ingots.size).toMatchSnapshot()
        expect([...sepraisal.ingots.keys()]).toMatchSnapshot()
        expect([...sepraisal.ingots.values()]).toMatchSnapshot()
    })
    test('should build all components', async () => {
        expect(sepraisal.components.size).toMatchSnapshot()
        expect([...sepraisal.components.keys()]).toMatchSnapshot()
        expect([...sepraisal.components.values()]).toMatchSnapshot()
    })
}

describe('PraisalManager with vanilla materials only', () => {
    beforeEach(async () => {
        sepraisal = new PraisalManager()
        await sepraisal.addPhysicalItemsSbc(physicalItemsSbcVanilla, VENDOR_MOD.VANILLA)
        await sepraisal.addBlueprintsSbc(materialsSbcVanilla, VENDOR_MOD.VANILLA)
        await sepraisal.addComponentsSbc(componentsSbcVanilla, VENDOR_MOD.VANILLA)
        sepraisal.build()
    })
    testMaterials()
})
describe('PraisalManager with economy materials only', () => {
    beforeEach(async () => {
        sepraisal = new PraisalManager()
        await sepraisal.addPhysicalItemsSbc(physicalItemsSbcEconomy, VENDOR_MOD.ECONOMY)
        await sepraisal.addBlueprintsSbc(materialsSbcEconomy, VENDOR_MOD.ECONOMY)
        await sepraisal.addComponentsSbc(componentsSbcEconomy, VENDOR_MOD.ECONOMY)
        sepraisal.build()
    })
    testMaterials()
})
