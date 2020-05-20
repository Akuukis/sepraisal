import { VENDOR_MOD } from '@sepraisal/common/src'
import { readFileSync } from 'fs'
import { join } from 'path'

import { PraisalManager } from '../src'


// tslint:disable: no-duplicate-string
const VENDOR_DIR = join(__dirname, '..', 'vendor')


let sepraisal: PraisalManager
beforeEach(async () => {
    sepraisal = new PraisalManager()
    const physicalItemsSbc = readFileSync(join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'PhysicalItems.sbc')).toString()
    const materialsSbc = readFileSync(join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'Blueprints.sbc')).toString()
    const componentsSbc = readFileSync(join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'Components.sbc')).toString()
    await sepraisal.addPhysicalItemsSbc(physicalItemsSbc, VENDOR_MOD.VANILLA)
    await sepraisal.addBlueprintsSbc(materialsSbc, VENDOR_MOD.VANILLA)
    await sepraisal.addComponentsSbc(componentsSbc, VENDOR_MOD.VANILLA)
    sepraisal.build()
})

describe('PraisalManager.addSbc', () => {
    beforeAll(async () => {
    })
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
})
describe('PraisalManager.addCubes', () => {
    test('should succeed based on vendor assets', async () => {
        const cubeBlocksSbcs = [
            readFileSync(join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks.sbc')).toString(),
            readFileSync(join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Armor.sbc')).toString(),
            readFileSync(join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Automation.sbc')).toString(),
            readFileSync(join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Communications.sbc')).toString(),
            readFileSync(join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Control.sbc')).toString(),
            readFileSync(join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Doors.sbc')).toString(),
            readFileSync(join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Energy.sbc')).toString(),
            readFileSync(join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Extras.sbc')).toString(),
            readFileSync(join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Gravity.sbc')).toString(),
            readFileSync(join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Interiors.sbc')).toString(),
            readFileSync(join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_LCDPanels.sbc')).toString(),
            readFileSync(join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Lights.sbc')).toString(),
            readFileSync(join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Logistics.sbc')).toString(),
            readFileSync(join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Mechanical.sbc')).toString(),
            readFileSync(join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Medical.sbc')).toString(),
            readFileSync(join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Production.sbc')).toString(),
            readFileSync(join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Thrusters.sbc')).toString(),
            readFileSync(join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Tools.sbc')).toString(),
            readFileSync(join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Utility.sbc')).toString(),
            readFileSync(join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Weapons.sbc')).toString(),
            readFileSync(join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Wheels.sbc')).toString(),
            readFileSync(join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Windows.sbc')).toString(),
        ]
        for(const cubeBlocksSbc of cubeBlocksSbcs) await sepraisal.addCubes(cubeBlocksSbc)
        expect([...sepraisal.cubes.entries()][2]).toMatchSnapshot()
        expect([...sepraisal.cubes.keys()]).toMatchSnapshot()
        expect(sepraisal.cubes.size).toMatchSnapshot()
    })
})
