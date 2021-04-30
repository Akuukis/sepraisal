import { NewPraisalManager, VENDOR_DIR } from '@sepraisal/praisal/lib/NewPraisalManager'
import { readFileSync } from 'fs'
import { join } from 'path'

;
(async () => {
    const sePraisal = await NewPraisalManager()()

    const praisal = await sePraisal.praiseSbc(readFileSync(join(VENDOR_DIR, 'prefabs', 'AtmosphericLander.sbc'), 'utf-8'))
    // const praisal = await sepraisal.praiseSbc(readFileSync(join(__dirname, 'assets', 'blueprints', 'dekartaTests.sbc'), 'utf-8'))
    // console.log(praisal.blummary.count)
    // console.log([...praisal.groups.entries()].map(([key, group]) => `${key}: ${group.blockCount}`))
    console.log(praisal.integrityPlanes.maxValue)
    // console.log(praisal.silhouette)
})().catch((err) => console.error(err))
