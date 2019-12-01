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
        const physicalItemsXml = readFileSync(join(VENDOR_DIR, 'PhysicalItems.sbc')).toString()
        await sepraisal.addOres(physicalItemsXml)
        expect([...sepraisal.ores.entries()][0]).toMatchSnapshot()
        expect([...sepraisal.ores.keys()]).toMatchSnapshot()
        expect(sepraisal.ores.size).toEqual(13)
    })
})
describe('PraisalManager.addIngots', () => {
    test('should succeed based on vendor assets', async () => {
        const materialsXml = readFileSync(join(VENDOR_DIR, 'Blueprints.sbc')).toString()
        const physicalItemsXml = readFileSync(join(VENDOR_DIR, 'PhysicalItems.sbc')).toString()
        await sepraisal.addIngots(physicalItemsXml, materialsXml)
        expect([...sepraisal.ingots.entries()][0]).toMatchSnapshot()
        expect([...sepraisal.ingots.keys()]).toMatchSnapshot()
        expect(sepraisal.ingots.size).toEqual(10)
    })
})
describe('PraisalManager.addComponents', () => {
    test('should succeed based on vendor assets', async () => {
        const componentsXml = readFileSync(join(VENDOR_DIR, 'Components.sbc')).toString()
        const materialsXml = readFileSync(join(VENDOR_DIR, 'Blueprints.sbc')).toString()
        await sepraisal.addComponents(materialsXml, componentsXml)
        expect([...sepraisal.components.entries()][0]).toMatchSnapshot()
        expect([...sepraisal.components.keys()]).toMatchSnapshot()
        expect(sepraisal.components.size).toEqual(23)
    })
})
describe('PraisalManager.addCubes', () => {
    test('should succeed based on vendor assets', async () => {
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
        for(const cubeBlocksXml of cubeBlocksXmls) await sepraisal.addCubes(cubeBlocksXml)
        expect([...sepraisal.cubes.entries()][2]).toMatchSnapshot()
        expect([...sepraisal.cubes.keys()]).toMatchSnapshot()
        expect(sepraisal.cubes.size).toEqual(366)
    })
})
