import { BLOCK_GROUPS, VENDOR_MOD } from '@sepraisal/common'
import { readFileSync } from 'fs'
import { join } from 'path'

import { PraisalManager } from './PraisalManager'

export const VENDOR_DIR = join(__dirname, '..', 'vendor')

export const NewPraisalManager = (): () => Promise<PraisalManager> => {
    const cubeBlocksSbcs = [
        [VENDOR_MOD.VANILLA     , join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks.sbc')],
        [VENDOR_MOD.VANILLA     , join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Armor.sbc')],
        [VENDOR_MOD.VANILLA     , join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Automation.sbc')],
        [VENDOR_MOD.VANILLA     , join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Communications.sbc')],
        [VENDOR_MOD.VANILLA     , join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Control.sbc')],
        [VENDOR_MOD.VANILLA     , join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Doors.sbc')],
        [VENDOR_MOD.VANILLA     , join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Energy.sbc')],
        [VENDOR_MOD.VANILLA     , join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Extras.sbc')],
        [VENDOR_MOD.VANILLA     , join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Gravity.sbc')],
        [VENDOR_MOD.VANILLA     , join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Interiors.sbc')],
        [VENDOR_MOD.VANILLA     , join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_LCDPanels.sbc')],
        [VENDOR_MOD.VANILLA     , join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Lights.sbc')],
        [VENDOR_MOD.VANILLA     , join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Logistics.sbc')],
        [VENDOR_MOD.VANILLA     , join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Mechanical.sbc')],
        [VENDOR_MOD.VANILLA     , join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Medical.sbc')],
        [VENDOR_MOD.VANILLA     , join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Production.sbc')],
        [VENDOR_MOD.VANILLA     , join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Symbols.sbc')],
        [VENDOR_MOD.VANILLA     , join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Thrusters.sbc')],
        [VENDOR_MOD.VANILLA     , join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Tools.sbc')],
        [VENDOR_MOD.VANILLA     , join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Utility.sbc')],
        [VENDOR_MOD.VANILLA     , join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Weapons.sbc')],
        [VENDOR_MOD.VANILLA     , join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Wheels.sbc')],
        [VENDOR_MOD.VANILLA     , join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks', 'CubeBlocks_Windows.sbc')],

        [VENDOR_MOD.DECORATIVE_1        , join(VENDOR_DIR, VENDOR_MOD.DECORATIVE_1      , 'CubeBlocks.sbc')],
        [VENDOR_MOD.DECORATIVE_2        , join(VENDOR_DIR, VENDOR_MOD.DECORATIVE_2      , 'CubeBlocks.sbc')],
        [VENDOR_MOD.ECONOMY             , join(VENDOR_DIR, VENDOR_MOD.ECONOMY           , 'CubeBlocks.sbc')],
        [VENDOR_MOD.FROSTBITE           , join(VENDOR_DIR, VENDOR_MOD.FROSTBITE         , 'CubeBlocks.sbc')],
        [VENDOR_MOD.SPARKSOFTHEFUTURE   , join(VENDOR_DIR, VENDOR_MOD.SPARKSOFTHEFUTURE , 'CubeBlocks.sbc')],
    ].map(([mod, path]) => [mod, readFileSync(path).toString()] as [VENDOR_MOD, string])
    const componentsSbc = readFileSync(join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'Components.sbc')).toString()
    const blueprintsSbc = readFileSync(join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'Blueprints.sbc')).toString()
    const physicalItemsSbc = readFileSync(join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'PhysicalItems.sbc')).toString()

    return async () => {
        const sepraisal = new PraisalManager()
        await sepraisal.addPhysicalItemsSbc(physicalItemsSbc, VENDOR_MOD.VANILLA)
        await sepraisal.addBlueprintsSbc(blueprintsSbc, VENDOR_MOD.VANILLA)
        await sepraisal.addComponentsSbc(componentsSbc, VENDOR_MOD.VANILLA)
        for(const [mod, cubeBlocksSbc] of cubeBlocksSbcs) await sepraisal.addCubeBlocksSbc(cubeBlocksSbc, mod)
        sepraisal.build()
        sepraisal.addGroups(BLOCK_GROUPS)

        return sepraisal
    }
}
