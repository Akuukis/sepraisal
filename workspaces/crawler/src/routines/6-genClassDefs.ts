import { CLASSES, getApiUrl, IBlueprint } from '@sepraisal/common'
import FormData from 'form-data'
import { createReadStream, readFileSync, writeFileSync } from 'fs'
import fetch from 'node-fetch'
import { join } from 'path'

import { lstatAsync } from '../utils'

export const API_URL = 'https://db.spaceengineerspraisal.net/hello'
const HOST = 'http://localhost:8004/ocpu/'

interface IScriptVariables {
    class: string,
    csv?: string,
    field: string,
    subclass: string,
}

const prepareScript = (filename: string, vars: IScriptVariables) => {
    const script = readFileSync(filename).toString()
        .replace(/__CSV__/g, `${vars.csv}/data.csv`)
        .replace(/__field__/g, vars.field)
        .replace(/__class__/g, vars.class)
        .replace(/__subclass__/g, vars.subclass)

    if(script.includes('"')) throw new Error('Do NOT use double-quotes in R script!')

    return escape(script)
        .replace(/\+/g, '%2B')
        .replace(/%0A/g, '\\n')
}


const uploadCsv = async (path: string): Promise<string> => {
    const stream = createReadStream(path)
    const form = new FormData()
    form.append('file', stream, {filename: 'data.csv'})

    const resCsv = await (await fetch(`${HOST}library/utils/R/read.csv`, {
        body: form,
        headers: form.getHeaders(),
        method: 'POST',
    })).text()
    const match = resCsv.match(/tmp\/(\w+)/)
    if(!match) throw new Error(resCsv)

    return match[1]
}


const runR = async (pathScript: string, vars: IScriptVariables) => {
    const result1 = await (await fetch(`${HOST}library/base/R/write`, {
        body: `x="${prepareScript(pathScript, vars)}"&file="script.r"`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        method: 'POST',
    })).text()
    if(result1.includes('Unparsable argument')) throw new Error('Unparsable argument')
    const match1 = result1.match(/tmp\/(\w+)/)
    if(!match1) throw new Error(result1)
    const id1 = match1[1]

    const result2 = await (await fetch(`${HOST}tmp/${id1}/files/script.r`, {method: 'POST'})).text()
    const match2 = result2.match(/tmp\/(\w+)/)
    if(!match2) throw new Error(result2)
    const id2 = match2[1]
    const url = `${HOST}tmp/${id2}`

    return {
        id: id2,

        chart: async () => (await fetch(`${url}/graphics/${12}/png?width=1500&height=500`)).buffer(),
        console: async () => (await fetch(`${url}/console/text`)).text(),
        get: async (varName: string) => (await fetch(`${url}/R/${varName}/print`)).text(),
        p: async () => Number((await (await fetch(`${url}/R/test/text`)).text()).split('\n')[2]),
        test: async () => (await fetch(`${url}/R/legend/text`)).text(),
    }
}


const runMyScript = async (csvPath: string, vars: IScriptVariables) => {
    const csv = await uploadCsv(csvPath)

    return runR('r/test.r', {csv, ...vars})
}

const toCacheName = (clas: string) => join('tmp', `${clas}-sample.csv`)

export const main = async () => {
    // let client: null | MongoClient = null
    try {
        // client = await MongoClient.connect(DB_URL, { useNewUrlParser: true })
        console.info('Connected successfully to server.')
        // const db = client.db(DB_NAME)
        // const collection = db.collection<IBlueprint>('blueprints')

        // console.log(await db.listCollections())
        for(const [groupName, group] of Object.entries(CLASSES)) {
            const {distributions} = group
            if(distributions.length === 0) {
                console.info(`Skipping class definitions for "${groupName}" due missing distributions.`)
                continue
            }

            console.info(`Generating class definitions for "${groupName}"..`)
            const cachefile = toCacheName(groupName)

            if(!(await lstatAsync(cachefile))) {
                process.stdout.write(`- Fetching training sample.. `)
                const distributionsPrefixed = group.distributions.map((dist) => `sbc.${dist}`)

                const projection = distributionsPrefixed
                    .reduce<Record<string, true>>((dict, dist) => {
                        dict[dist] = true

                        return dict
                    },      Object.create(null) as {})

                const docs: IBlueprint[] = []

                let page = 0
                while(page >= 0) {
                    const res = await fetch(getApiUrl(group.criteriaToTrain, projection, undefined, 100, page * 100))
                    const {docs: docsPage} = await res.json() as {count: number, docs: IBlueprint[] }
                    docs.push(...docsPage)
                    page += 1

                    process.stdout.write('.')
                    if(docsPage.length === 0) page = -1
                }

                // const docs = (await collection
                //     .find(group.criteriaToTrain)
                //     .limit(999999)
                //     .project(projection)
                //     .toArray())

                if(docs.length < 100) throw new Error(`Found insufficient blueprints for the training set: ${docs.length}`)

                console.info(`\n- Found ${docs.length} samples.`)

                const lines = docs.map((doc) => distributions.map((field) => doc.sbc![field]))

                const dataAsCsv = [
                        distributions.join(','),
                        ...lines,
                    ].join('\n')

                writeFileSync(cachefile, dataAsCsv)
                console.info(`- Cached the dataset.`)
            } else {
                console.info(`- Found cached dataset.`)
            }
            const csv = await uploadCsv(cachefile)

            for(const field of distributions) {
                const results = await runR(join(__dirname, '..', 'r', 'test.r'), {csv, field, class: groupName, subclass: 'no-subclass'})
                // console.log(await results.get('buckets'))
                // console.log(await results.get('null.probs'))
                const path = join('tmp', `${groupName}-${field}.png`)
                console.info(`${path}-${((await results.p()) * 100).toFixed(2)}%`)
                // console.log(await results.console())
                // console.log(`${groupName}-${field}-${p.toFixed(2)}%.png`)
                writeFileSync(path, await results.chart())
                // break
            }
        }
    } finally {
        // if(client !== null) await client.close()
    }

}
