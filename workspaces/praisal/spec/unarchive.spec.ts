import { createReadStream } from 'fs'
import { join } from 'path'

import { PraisalManager } from '../src'
import { parseSteamArchive } from '../src/parseSteamArchive'
import { NewPraisalManager } from './_utils'


const FIXTURES_DIR = join(__dirname, 'fixtures')
const newPraisalManager = NewPraisalManager()

let sepraisal: PraisalManager
beforeEach(async () => {
    sepraisal = await newPraisalManager()
})

const testBlueprint = (title: string, archive: string) => {
    test(`should succeed to praise random small steam blueprint (${title})`, async () => {

        const xml = await parseSteamArchive(createReadStream(join(FIXTURES_DIR, archive)))
        const praisal = await sepraisal.praiseXml(xml)
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
    testBlueprint('Wyvern - Atmospheric Survival Ship', '659278800.1.zip')
    testBlueprint('O.S.C. Aldebaran-Class Heavy Cruiser', '383985794.2.zip')
    testBlueprint('PZK PCS - T340', '1315913931.2.zip')
})
