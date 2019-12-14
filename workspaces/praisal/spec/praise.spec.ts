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


const testBlueprint = (title: string, path: string) => {
    test(`should succeed to praise ${title}`, async () => {
        const praisal = await sepraisal.praiseXml(readFileSync(path, 'utf-8'))
        expect(praisal.toBlueprintSbc(0)).toMatchSnapshot({
            integrityPlanes: {
                front: expect.any(Array),
                side: expect.any(Array),
                top: expect.any(Array),
            },
        })
        const {front, side, top} = praisal.previewPlanes()
        expect(front).toMatchSnapshot()
        expect(side).toMatchSnapshot()
        expect(top).toMatchSnapshot()
    })
}

describe('PraisalManager.praiseXml', () => {
    testBlueprint('AtmosphericLander', join(PREFABS_DIR, 'AtmosphericLander.sbc'))
    testBlueprint('RespawnShip', join(PREFABS_DIR, 'RespawnShip.sbc'))
    testBlueprint('dekartaTests', join(MY_BLUEPRINTS_DIR, 'dekartaTests.sbc'))
    testBlueprint('EveryLargeBlockOnce', join(MY_BLUEPRINTS_DIR, 'EveryLargeBlockOnce.sbc'))
})
