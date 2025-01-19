import { readFileSync } from 'fs'
import { join } from 'path'

import { NewPraisalManager, VENDOR_DIR } from '../src/NewPraisalManager'

import { PraisalManager } from '../src'


const PREFABS_DIR = join(VENDOR_DIR, 'prefabs')
const MY_BLUEPRINTS_DIR = join(VENDOR_DIR, 'myBlueprints')

const newPraisalManager = NewPraisalManager()

let sepraisal: PraisalManager
beforeEach(async () => {
    sepraisal = await newPraisalManager()
})


const testBlueprint = (title: string, path: string) => {
    test(`should succeed to praise ${title}`, async () => {
        const praisal = await sepraisal.praiseSbc(readFileSync(path, 'utf-8'))
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

describe('PraisalManager.praiseSbc', () => {
    testBlueprint('AtmosphericLander', join(PREFABS_DIR, 'AtmosphericLander.sbc'))
    testBlueprint('RespawnShip', join(PREFABS_DIR, 'RespawnShip.sbc'))
    testBlueprint('dekartaTests', join(MY_BLUEPRINTS_DIR, 'dekartaTests.sbc'))
    testBlueprint('EveryLargeBlockOnce', join(MY_BLUEPRINTS_DIR, 'EveryLargeBlockOnce.sbc'))
    testBlueprint('AllBlocksContact', join(MY_BLUEPRINTS_DIR, 'AllBlocksContact.sbc'))
    testBlueprint('AllBlocksDecoPack3', join(MY_BLUEPRINTS_DIR, 'AllBlocksDecoPack3.sbc'))
    testBlueprint('AllBlocksSignal', join(MY_BLUEPRINTS_DIR, 'AllBlocksSignal.sbc'))
    testBlueprint('AllBlocksWarfare2', join(MY_BLUEPRINTS_DIR, 'AllBlocksWarfare2.sbc'))
    testBlueprint('AllBlocksAutomaton', join(MY_BLUEPRINTS_DIR, 'AllBlocksAutomaton.sbc'))
    testBlueprint('AllBlocksPrototech', join(MY_BLUEPRINTS_DIR, 'AllBlocksPrototech.sbc'))
})
