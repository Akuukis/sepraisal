import { VENDOR_MOD } from '@sepraisal/common/src'
import { readFileSync } from 'fs'
import { join } from 'path'

import { PraisalManager } from '../src'


// tslint:disable: no-duplicate-string
const VENDOR_DIR = join(__dirname, '..', 'vendor')


let sepraisal: PraisalManager
beforeEach(() => {
    sepraisal = new PraisalManager()
})

describe('PraisalManager.addOres', () => {
    test('should succeed based on vendor assets', async () => {
        const physicalItemsSbc = readFileSync(join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'PhysicalItems.sbc')).toString()
        await sepraisal.addOres(physicalItemsSbc)
        expect([...sepraisal.ores.entries()][0]).toMatchSnapshot()
        expect([...sepraisal.ores.keys()]).toMatchSnapshot()
        expect(sepraisal.ores.size).toEqual(13)
    })
})
describe('PraisalManager.addIngots', () => {
    test('should succeed based on vendor assets', async () => {
        const blueprintsSbc = readFileSync(join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'Blueprints.sbc')).toString()
        const physicalItemsSbc = readFileSync(join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'PhysicalItems.sbc')).toString()
        await sepraisal.addIngots(physicalItemsSbc, blueprintsSbc)
        expect([...sepraisal.ingots.entries()][0]).toMatchSnapshot()
        expect([...sepraisal.ingots.keys()]).toMatchSnapshot()
        expect(sepraisal.ingots.size).toEqual(10)
    })
})
describe('PraisalManager.addComponents', () => {
    test('should succeed based on vendor assets', async () => {
        const componentsSbc = readFileSync(join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'Components.sbc')).toString()
        const blueprintsSbc = readFileSync(join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'Blueprints.sbc')).toString()
        await sepraisal.addComponents(blueprintsSbc, componentsSbc)
        expect([...sepraisal.components.entries()][0]).toMatchSnapshot()
        expect([...sepraisal.components.keys()]).toMatchSnapshot()
        expect(sepraisal.components.size).toEqual(23)
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
