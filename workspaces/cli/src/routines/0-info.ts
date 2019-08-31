import { DB_NAME, DB_URL, IBlueprint } from '@sepraisal/common'
import { MongoClient } from 'mongodb'
import * as pad from 'pad'

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
export const main = async () => {
    const client = await MongoClient.connect(DB_URL, { useNewUrlParser: true })
    console.info('Connected successfully to server')
    const db = client.db(DB_NAME)
    const collection = db.collection<IBlueprint>('blueprints')

    // tslint:disable-next-line: no-commented-code - Snippets for database indexing.
    // console.log(await db.indexInformation('blueprints'))
    // console.log(await db.collection('blueprints').dropIndex('TextIndex'))
    // console.log(await db.collection('blueprints').createIndex({
    //         '_id': 'text',
    //         'steam.title': 'text',
    //         'steam.author.title': 'text',
    //         'steam.description': 'text',
    //         'sbc.gridTitle': 'text',
    //     },
    //     {
    //         name: 'TextIndex',
    //         weights: {
    //             '_id': 16,
    //             'steam.title': 8,
    //             'steam.author.title': 4,
    //             'sbc.gridTitle': 2,
    //             'steam.description': 1,
    //         }
    //     } as any))

    // Snippet for pruning the database.
    // const deleted = await collection.deleteMany({'steam.subscriberCount': {$lt: 100}})
    // console.log(`Pruned: ${deleted.result.n}`)


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
            'pendingClass',
                'pendingClassInitial',
                'pendingClassOutdated',
                'pendingClassStale',
        'errors',
            'pendingScrapeError',
            'pendingThumbError',
            'pendingPraiseError',
            'pendingClassError',
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
