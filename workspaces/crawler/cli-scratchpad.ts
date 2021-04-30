#!/usr/bin/env -S deno -q --unstable run
// deno-language: ts

import { NewPraisalManager, VENDOR_DIR } from '../praisal/src/NewPraisalManager.ts'
import { readFileSync } from 'fs'
import { join } from 'path'

;
(async () => {
    const sePraisal = await NewPraisalManager()()
    const files = [
        readFileSync(join(VENDOR_DIR, 'prefabs', 'AtmosphericLander.sbc'), 'utf-8'),
        readFileSync(join(VENDOR_DIR, 'prefabs', 'AlienLander.sbc'), 'utf-8'),
        readFileSync(join(VENDOR_DIR, 'prefabs', 'MarsLander.sbc'), 'utf-8'),
        readFileSync(join(VENDOR_DIR, 'prefabs', 'RespawnShip.sbc'), 'utf-8'),
        readFileSync(join(VENDOR_DIR, 'myBlueprints', 'dekartaTests.sbc'), 'utf-8'),
        readFileSync(join(VENDOR_DIR, 'myBlueprints', 'EveryLargeBlockOnce.sbc'), 'utf-8'),
    ]
    console.time()
    await Promise.all(files.map((file) => sePraisal.praiseSbc(file)))
    console.timeEnd()
    // console.log(praisal.blummary.count)
    // console.log([...praisal.groups.entries()].map(([key, group]) => `${key}: ${group.blockCount}`))
    // console.log(praisal.integrityPlanes.maxValue)
    // console.log(praisal.silhouette)
})().catch((err) => console.error(err))
