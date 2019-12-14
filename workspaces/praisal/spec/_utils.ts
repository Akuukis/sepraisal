import { BLOCK_GROUPS } from '@sepraisal/common'
import { readFileSync } from 'fs'
import { join } from 'path'

import { PraisalManager } from '../src'

export const VENDOR_DIR = join(__dirname, '..', 'vendor')

export const NewPraisalManager = () => {
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
    const componentsXml = readFileSync(join(VENDOR_DIR, 'Components.sbc')).toString()
    const materialsXml = readFileSync(join(VENDOR_DIR, 'Blueprints.sbc')).toString()
    const physicalItemsXml = readFileSync(join(VENDOR_DIR, 'PhysicalItems.sbc')).toString()

    return async () => {
        const sepraisal = new PraisalManager()
        await sepraisal.addOres(physicalItemsXml)
        await sepraisal.addIngots(physicalItemsXml, materialsXml)
        await sepraisal.addComponents(materialsXml, componentsXml)
        for(const cubeBlocksXml of cubeBlocksXmls) await sepraisal.addCubes(cubeBlocksXml)
        sepraisal.addGroups(BLOCK_GROUPS)

        return sepraisal
    }
}
