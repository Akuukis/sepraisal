import { BLOCK_GROUPS } from '@sepraisal/common'
import { PraisalManager } from '@sepraisal/praisal'
import { readFileSync } from 'fs'
import { join } from 'path'

const VENDOR_DIR = join(require.resolve('@sepraisal/praisal'), '..', '..', 'vendor')

;
(async () => {
    const sepraisal = new PraisalManager()

    const cubeBlocksXml = readFileSync(join(VENDOR_DIR, 'CubeBlocks.sbc')).toString()
    const componentsXml = readFileSync(join(VENDOR_DIR, 'Components.sbc')).toString()
    const materialsXml = readFileSync(join(VENDOR_DIR, 'Blueprints.sbc')).toString()
    const physicalItemsXml = readFileSync(join(VENDOR_DIR, 'PhysicalItems.sbc')).toString()
    await sepraisal.addOres(physicalItemsXml)
    await sepraisal.addIngots(physicalItemsXml, materialsXml)
    await sepraisal.addComponents(materialsXml, componentsXml)
    await sepraisal.addCubes(cubeBlocksXml)
    sepraisal.addGroups(BLOCK_GROUPS)

    const praisal = await sepraisal.praiseXml(readFileSync(join(VENDOR_DIR, 'prefabs', 'AtmosphericLander.sbc'), 'utf-8'))
    // const praisal = await sepraisal.praiseXml(readFileSync(join(__dirname, 'assets', 'blueprints', 'dekartaTests.sbc'), 'utf-8'))
    // console.log(praisal.blummary.count)
    // console.log([...praisal.groups.entries()].map(([key, group]) => `${key}: ${group.blockCount}`))
    console.log(praisal.integrityPlanes.maxValue)
    // console.log(praisal.silhouette)
})().catch((err)=>console.error(err))
