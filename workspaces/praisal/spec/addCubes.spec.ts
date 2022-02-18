import { VENDOR_MOD } from '@sepraisal/common/src'
import { readFileSync } from 'fs'
import { basename, join } from 'path'

import { Cube, PraisalManager } from '../src'


const VENDOR_DIR = join(__dirname, '..', 'vendor')

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
    testCubeBlocksFile(VENDOR_MOD.VANILLA, join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks.sbc'))
    testCubeBlocksFile(VENDOR_MOD.VANILLA, join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Armor.sbc'))
    testCubeBlocksFile(VENDOR_MOD.VANILLA, join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_ArmorPanels.sbc'))
    testCubeBlocksFile(VENDOR_MOD.VANILLA, join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Armor_2.sbc'))
    testCubeBlocksFile(VENDOR_MOD.VANILLA, join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Automation.sbc'))
    testCubeBlocksFile(VENDOR_MOD.VANILLA, join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Communications.sbc'))
    testCubeBlocksFile(VENDOR_MOD.VANILLA, join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Control.sbc'))
    testCubeBlocksFile(VENDOR_MOD.VANILLA, join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Doors.sbc'))
    testCubeBlocksFile(VENDOR_MOD.VANILLA, join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Energy.sbc'))
    testCubeBlocksFile(VENDOR_MOD.VANILLA, join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Extras.sbc'))
    testCubeBlocksFile(VENDOR_MOD.VANILLA, join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Gravity.sbc'))
    testCubeBlocksFile(VENDOR_MOD.VANILLA, join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Interiors.sbc'))
    testCubeBlocksFile(VENDOR_MOD.VANILLA, join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_LCDPanels.sbc'))
    testCubeBlocksFile(VENDOR_MOD.VANILLA, join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Lights.sbc'))
    testCubeBlocksFile(VENDOR_MOD.VANILLA, join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Logistics.sbc'))
    testCubeBlocksFile(VENDOR_MOD.VANILLA, join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Mechanical.sbc'))
    testCubeBlocksFile(VENDOR_MOD.VANILLA, join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Medical.sbc'))
    testCubeBlocksFile(VENDOR_MOD.VANILLA, join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Production.sbc'))
    testCubeBlocksFile(VENDOR_MOD.VANILLA, join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Symbols.sbc'))
    testCubeBlocksFile(VENDOR_MOD.VANILLA, join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Thrusters.sbc'))
    testCubeBlocksFile(VENDOR_MOD.VANILLA, join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Tools.sbc'))
    testCubeBlocksFile(VENDOR_MOD.VANILLA, join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Utility.sbc'))
    testCubeBlocksFile(VENDOR_MOD.VANILLA, join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Weapons.sbc'))
    testCubeBlocksFile(VENDOR_MOD.VANILLA, join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Wheels.sbc'))
    testCubeBlocksFile(VENDOR_MOD.VANILLA, join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Windows.sbc'))

    testCubeBlocksFile(VENDOR_MOD.DECORATIVE_1      , join(VENDOR_DIR, VENDOR_MOD.DECORATIVE_1      , 'CubeBlocks.sbc'))
    testCubeBlocksFile(VENDOR_MOD.DECORATIVE_2      , join(VENDOR_DIR, VENDOR_MOD.DECORATIVE_2      , 'CubeBlocks.sbc'))
    testCubeBlocksFile(VENDOR_MOD.ECONOMY           , join(VENDOR_DIR, VENDOR_MOD.ECONOMY           , 'CubeBlocks.sbc'))
    testCubeBlocksFile(VENDOR_MOD.FROSTBITE         , join(VENDOR_DIR, VENDOR_MOD.FROSTBITE         , 'CubeBlocks.sbc'))
    testCubeBlocksFile(VENDOR_MOD.SPARKSOFTHEFUTURE , join(VENDOR_DIR, VENDOR_MOD.SPARKSOFTHEFUTURE , 'CubeBlocks.sbc'))
    testCubeBlocksFile(VENDOR_MOD.SCRAPRACEPACK     , join(VENDOR_DIR, VENDOR_MOD.SCRAPRACEPACK     , 'CubeBlocks.sbc'))
    testCubeBlocksFile(VENDOR_MOD.WARFARE_1         , join(VENDOR_DIR, VENDOR_MOD.WARFARE_1         , 'CubeBlocks.sbc'))
    testCubeBlocksFile(VENDOR_MOD.INDUSTRIAL        , join(VENDOR_DIR, VENDOR_MOD.INDUSTRIAL        , 'CubeBlocks.sbc'))
    testCubeBlocksFile(VENDOR_MOD.WARFARE_2         , join(VENDOR_DIR, VENDOR_MOD.WARFARE_2         , 'CubeBlocks.sbc'))
})
