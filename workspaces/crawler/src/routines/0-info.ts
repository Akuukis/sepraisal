import { DB_NAME, DB_URL, IBlueprint } from '@sepraisal/common'
import { MongoClient } from 'mongodb'
import pad from 'pad'

import { QUERIES } from '../queries'


const Percent = (total: number) => (amount: number) => {
    const share = Math.round(amount / total * 100 * 10) / 10

    return `${pad(4, String(share))}%`
}
const indent = (filter: string): string => {
    if(filter.includes('Error')) return '        '
    if(filter.length > 'pendingPraise'.length) return '               '
    if(filter.length > 'pending'.length) return '        '

    return ''
}

// Use connect method to connect to the server
export const main = async (): Promise<void> => {
    const client = await MongoClient.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    console.info('Connected successfully to server')
    const db = client.db(DB_NAME)
    const collection = db.collection<IBlueprint>('blueprints')


    const filters: Array<keyof typeof QUERIES> = [
        'ok',
        'pending',
        'pendingScrape',
        'pendingScrapeInitial',
        'pendingScrapeOutdated',
        'pendingScrapeStale',
        'pendingThumb',
        'pendingThumbInitial',
        'pendingThumbOutdated',
        'pendingThumbStale',
        'pendingPraise',
        'pendingPraiseInitial',
        'pendingPraiseOutdated',
        'pendingPraiseStale',
        // 'pendingClass',
        //     'pendingClassInitial',
        //     'pendingClassOutdated',
        //     'pendingClassStale',
        'errors',
        'pendingScrapeError',
        'pendingThumbError',
        'pendingPraiseError',
        // 'pendingClassError',
    ]

    const total = await collection.find().count()
    const percent = Percent(total)
    console.info('Total:', total)

    for(const filter of filters) {
        // await collection.deleteMany({})
        const docs = await collection
            .find(QUERIES[filter])
            // .skip(0)
            // .limit(10)
            // .project({_id: true})
            // .toArray()
            .count()
        console.info(`${indent(filter)}- ${percent(docs)} ${filter} (${docs})`)
    }

    await client.close()
}
