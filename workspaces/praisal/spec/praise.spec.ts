import { readFileSync } from 'fs'
import { join } from 'path'

import { PraisalManager } from '../src'
import { NewPraisalManager, VENDOR_DIR } from './_utils'


const PREFABS_DIR = join(VENDOR_DIR, 'prefabs')
const MY_BLUEPRINTS_DIR = join(VENDOR_DIR, 'myBlueprints')

const newPraisalManager = NewPraisalManager()

let sepraisal: PraisalManager
beforeEach(async () => {
    sepraisal = await newPraisalManager()
})

describe('PraisalManager.praiseXml', () => {
    test('should succeed to praise AtmosphericLander', async () => {
        const praisal = await sepraisal.praiseXml(readFileSync(join(PREFABS_DIR, 'AtmosphericLander.sbc'), 'utf-8'))
    })
    test('should succeed to praise RespawnShip', async () => {
        const praisal = await sepraisal.praiseXml(readFileSync(join(PREFABS_DIR, 'RespawnShip.sbc'), 'utf-8'))
    })
    test('should succeed to praise dekartaTests', async () => {
        const praisal = await sepraisal.praiseXml(readFileSync(join(MY_BLUEPRINTS_DIR, 'dekartaTests.sbc'), 'utf-8'))
    })
    test('should succeed to praise EveryLargeBlockOnce', async () => {
        const praisal = await sepraisal.praiseXml(readFileSync(join(MY_BLUEPRINTS_DIR, 'EveryLargeBlockOnce.sbc'), 'utf-8'))
    })
})
