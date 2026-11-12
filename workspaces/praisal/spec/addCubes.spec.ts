import { VENDOR_MOD } from '@sepraisal/common/src'
import { readFileSync } from 'fs'
import { basename, join } from 'path'

import { Cube, PraisalManager } from '../src'
import { getVanillaCubeBlocksPaths, VENDOR_DIR } from '../src/vendorFiles'

const physicalItemsSbcVanilla = readFileSync(join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'PhysicalItems.sbc')).toString()
const materialsSbcVanilla = readFileSync(join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'Blueprints.sbc')).toString()
const componentsSbcVanilla = readFileSync(join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'Components.sbc')).toString()

let sepraisalManager: PraisalManager

const testCubeBlocksFile = (mod: VENDOR_MOD, path: string) => {
    test(`should add ${mod} "${basename(path)}"`, async () => {
        const cubeBlocksSbcs = readFileSync(path).toString()
        await sepraisalManager.addCubeBlocksSbc(cubeBlocksSbcs, mod)
        sepraisalManager.build()
        expect(sepraisalManager.cubes.size).toMatchSnapshot()
        expect([...sepraisalManager.cubes.keys()]).toMatchSnapshot()
        ;[...sepraisalManager.cubes.values()].forEach((cube) => {
            expect({...cube}).toMatchSnapshot<Cube>({
                data: expect.any(Object)
            }, cube.title)
        })
    })
}

describe('PraisalManager.addCubes()', () => {
    beforeEach(async () => {
        // Add vanilla materials.
        sepraisalManager = new PraisalManager()
        await sepraisalManager.addPhysicalItemsSbc(physicalItemsSbcVanilla, VENDOR_MOD.VANILLA)
        await sepraisalManager.addBlueprintsSbc(materialsSbcVanilla, VENDOR_MOD.VANILLA)
        await sepraisalManager.addComponentsSbc(componentsSbcVanilla, VENDOR_MOD.VANILLA)
        sepraisalManager.build()
    })
    getVanillaCubeBlocksPaths().forEach((path) => {
        testCubeBlocksFile(VENDOR_MOD.VANILLA, path)
    })

    testCubeBlocksFile(VENDOR_MOD.DECORATIVE_1      , join(VENDOR_DIR, VENDOR_MOD.DECORATIVE_1      , 'CubeBlocks.sbc'))
    testCubeBlocksFile(VENDOR_MOD.DECORATIVE_2      , join(VENDOR_DIR, VENDOR_MOD.DECORATIVE_2      , 'CubeBlocks.sbc'))
    testCubeBlocksFile(VENDOR_MOD.ECONOMY           , join(VENDOR_DIR, VENDOR_MOD.ECONOMY           , 'CubeBlocks.sbc'))
    testCubeBlocksFile(VENDOR_MOD.FROSTBITE         , join(VENDOR_DIR, VENDOR_MOD.FROSTBITE         , 'CubeBlocks.sbc'))
    testCubeBlocksFile(VENDOR_MOD.SPARKSOFTHEFUTURE , join(VENDOR_DIR, VENDOR_MOD.SPARKSOFTHEFUTURE , 'CubeBlocks.sbc'))
    testCubeBlocksFile(VENDOR_MOD.SCRAPRACEPACK     , join(VENDOR_DIR, VENDOR_MOD.SCRAPRACEPACK     , 'CubeBlocks.sbc'))
    testCubeBlocksFile(VENDOR_MOD.WARFARE_1         , join(VENDOR_DIR, VENDOR_MOD.WARFARE_1         , 'CubeBlocks.sbc'))
    testCubeBlocksFile(VENDOR_MOD.INDUSTRIAL        , join(VENDOR_DIR, VENDOR_MOD.INDUSTRIAL        , 'CubeBlocks.sbc'))
    testCubeBlocksFile(VENDOR_MOD.WARFARE_2         , join(VENDOR_DIR, VENDOR_MOD.WARFARE_2         , 'CubeBlocks.sbc'))
    testCubeBlocksFile(VENDOR_MOD.GRIDAIPACK        , join(VENDOR_DIR, VENDOR_MOD.GRIDAIPACK        , 'CubeBlocks.sbc'))
    testCubeBlocksFile(VENDOR_MOD.DECORATIVE_3      , join(VENDOR_DIR, VENDOR_MOD.DECORATIVE_3      , 'CubeBlocks.sbc'))
    testCubeBlocksFile(VENDOR_MOD.SIGNALS           , join(VENDOR_DIR, VENDOR_MOD.SIGNALS           , 'CubeBlocks.sbc'))
    testCubeBlocksFile(VENDOR_MOD.CONTACT           , join(VENDOR_DIR, VENDOR_MOD.CONTACT           , 'CubeBlocks.sbc'))
    testCubeBlocksFile(VENDOR_MOD.FIELDWORK         , join(VENDOR_DIR, VENDOR_MOD.FIELDWORK         , 'CubeBlocks.sbc'))
    testCubeBlocksFile(VENDOR_MOD.APEXSURVIVALPACK  , join(VENDOR_DIR, VENDOR_MOD.APEXSURVIVALPACK  , 'CubeBlocks.sbc'))
    testCubeBlocksFile(VENDOR_MOD.CORESYSTEMSPACK   , join(VENDOR_DIR, VENDOR_MOD.CORESYSTEMSPACK   , 'CubeBlocks.sbc'))
    testCubeBlocksFile(VENDOR_MOD.ECONOMY2PACK      , join(VENDOR_DIR, VENDOR_MOD.ECONOMY2PACK      , 'CubeBlocks.sbc'))
    testCubeBlocksFile(VENDOR_MOD.PROSPERITYPACK    , join(VENDOR_DIR, VENDOR_MOD.PROSPERITYPACK    , 'CubeBlocks.sbc'))
})
