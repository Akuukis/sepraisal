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
        expect(sepraisal.components.size).toEqual(22)
    })
})
describe('PraisalManager.addCubes', () => {
    test('should succeed based on vendor assets', async () => {
        const cubeBlocksXml = readFileSync(join(VENDOR_DIR, 'CubeBlocks.sbc')).toString()
        await sepraisal.addCubes(cubeBlocksXml)
        expect([...sepraisal.cubes.entries()][2]).toMatchSnapshot()
        expect([...sepraisal.cubes.keys()]).toMatchSnapshot()
        expect(sepraisal.cubes.size).toEqual(307)
    })
})
