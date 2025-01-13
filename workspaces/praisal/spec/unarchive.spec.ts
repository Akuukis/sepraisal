import { readFileSync } from 'fs'
import { join } from 'path'

import { NewPraisalManager } from '../src/NewPraisalManager'
import { unzipCachedSbc } from '../src/unzipCachedSbc'

import { PraisalManager } from '../src'


const FIXTURES_DIR = join(__dirname, 'fixtures')
const newPraisalManager = NewPraisalManager()

let sepraisal: PraisalManager
beforeEach(async () => {
    sepraisal = await newPraisalManager()
})

const testBlueprint = (title: string, archive: string, sbcFilename: string) => {
    test(`should succeed to praise random small steam blueprint (${title})`, async () => {
        const xml = await unzipCachedSbc(readFileSync(join(FIXTURES_DIR, archive)), sbcFilename)
        const praisal = await sepraisal.praiseSbc(xml)
        expect(praisal.toBlueprintSbc(0)).toMatchSnapshot({
            integrityPlanes: {
                front: expect.any(Array),
                side: expect.any(Array),
                top: expect.any(Array),
            },
        })
    })
}

describe('PraisalManager.praiseSbc', () => {
    testBlueprint('Wyvern - Atmospheric Survival Ship', '659278800.1.zip', 'bp.sbc')
    testBlueprint('O.S.C. Aldebaran-Class Heavy Cruiser', '383985794.2.zip', 'bp.sbc')
    testBlueprint('PZK PCS - T340', '1315913931.2.zip', 'bp.sbc')
})