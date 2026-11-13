import { VENDOR_MOD } from '@sepraisal/common'

import { readFileSync } from 'fs'
import { join } from 'path'

import { PraisalManager } from './PraisalManager'
import { getVanillaCubeBlocksPaths, VENDOR_DIR } from './vendorFiles'

export { VENDOR_DIR }

export const NewPraisalManager = (): () => Promise<PraisalManager> => {
    const cubeBlocksSbcs = [
        ...getVanillaCubeBlocksPaths().map((path) => [VENDOR_MOD.VANILLA, path] as const),

        [VENDOR_MOD.DECORATIVE_1        , join(VENDOR_DIR, VENDOR_MOD.DECORATIVE_1      , 'CubeBlocks.sbc')],
        [VENDOR_MOD.DECORATIVE_2        , join(VENDOR_DIR, VENDOR_MOD.DECORATIVE_2      , 'CubeBlocks.sbc')],
        [VENDOR_MOD.ECONOMY             , join(VENDOR_DIR, VENDOR_MOD.ECONOMY           , 'CubeBlocks.sbc')],
        [VENDOR_MOD.FROSTBITE           , join(VENDOR_DIR, VENDOR_MOD.FROSTBITE         , 'CubeBlocks.sbc')],
        [VENDOR_MOD.SPARKSOFTHEFUTURE   , join(VENDOR_DIR, VENDOR_MOD.SPARKSOFTHEFUTURE , 'CubeBlocks.sbc')],
        [VENDOR_MOD.SCRAPRACEPACK       , join(VENDOR_DIR, VENDOR_MOD.SCRAPRACEPACK     , 'CubeBlocks.sbc')],
        [VENDOR_MOD.WARFARE_1           , join(VENDOR_DIR, VENDOR_MOD.WARFARE_1         , 'CubeBlocks.sbc')],
        [VENDOR_MOD.INDUSTRIAL          , join(VENDOR_DIR, VENDOR_MOD.INDUSTRIAL        , 'CubeBlocks.sbc')],
        [VENDOR_MOD.WARFARE_2           , join(VENDOR_DIR, VENDOR_MOD.WARFARE_2         , 'CubeBlocks.sbc')],
        [VENDOR_MOD.GRIDAIPACK          , join(VENDOR_DIR, VENDOR_MOD.GRIDAIPACK        , 'CubeBlocks.sbc')],
        [VENDOR_MOD.DECORATIVE_3        , join(VENDOR_DIR, VENDOR_MOD.DECORATIVE_3      , 'CubeBlocks.sbc')],
        [VENDOR_MOD.SIGNALS             , join(VENDOR_DIR, VENDOR_MOD.SIGNALS           , 'CubeBlocks.sbc')],
        [VENDOR_MOD.CONTACT             , join(VENDOR_DIR, VENDOR_MOD.CONTACT           , 'CubeBlocks.sbc')],
        [VENDOR_MOD.FIELDWORK           , join(VENDOR_DIR, VENDOR_MOD.FIELDWORK         , 'CubeBlocks.sbc')],
        [VENDOR_MOD.APEXSURVIVALPACK    , join(VENDOR_DIR, VENDOR_MOD.APEXSURVIVALPACK  , 'CubeBlocks.sbc')],
        [VENDOR_MOD.CORESYSTEMSPACK     , join(VENDOR_DIR, VENDOR_MOD.CORESYSTEMSPACK   , 'CubeBlocks.sbc')],
        [VENDOR_MOD.ECONOMY2PACK        , join(VENDOR_DIR, VENDOR_MOD.ECONOMY2PACK      , 'CubeBlocks.sbc')],
        [VENDOR_MOD.PROSPERITYPACK      , join(VENDOR_DIR, VENDOR_MOD.PROSPERITYPACK    , 'CubeBlocks.sbc')],
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
        // sepraisal.addGroups(BLOCK_GROUPS)

        return sepraisal
    }
}
