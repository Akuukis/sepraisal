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

describe('PraisalManager.praiseXml', () => {
    test('should succeed to praise random small steam blueprint (Wyvern - Atmospheric Survival Ship)', async () => {
        const archive = await parseSteamArchive(createReadStream(join(FIXTURES_DIR, '659278800.1.zip')))
        const praisal = await sepraisal.praiseXml(archive.blueprint)
    })
})
