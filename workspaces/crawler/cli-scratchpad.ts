import { BLOCK_GROUPS, VENDOR_MOD } from '@sepraisal/common'
import { PraisalManager } from '@sepraisal/praisal'
import { readFileSync } from 'fs'
import { join } from 'path'

const VENDOR_DIR = join(require.resolve('@sepraisal/praisal'), '..', '..', 'vendor')

;
(async () => {
    const sePraisal = new PraisalManager()

    const componentsXml = readFileSync(join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'Components.sbc')).toString()
    const materialsXml = readFileSync(join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'Blueprints.sbc')).toString()
    const physicalItemsXml = readFileSync(join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'PhysicalItems.sbc')).toString()
    const cubeBlocksXmls = [
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
    await sePraisal.addOres(physicalItemsXml)
    await sePraisal.addIngots(physicalItemsXml, materialsXml)
    await sePraisal.addComponents(materialsXml, componentsXml)
    for(const cubeBlocksXml of cubeBlocksXmls) await sePraisal.addCubes(cubeBlocksXml)
    sePraisal.addGroups(BLOCK_GROUPS)

    const praisal = await sePraisal.praiseXml(readFileSync(join(VENDOR_DIR, 'prefabs', 'AtmosphericLander.sbc'), 'utf-8'))
    // const praisal = await sepraisal.praiseXml(readFileSync(join(__dirname, 'assets', 'blueprints', 'dekartaTests.sbc'), 'utf-8'))
    // console.log(praisal.blummary.count)
    // console.log([...praisal.groups.entries()].map(([key, group]) => `${key}: ${group.blockCount}`))
    console.log(praisal.integrityPlanes.maxValue)
    // console.log(praisal.silhouette)
})().catch((err) => console.error(err))
