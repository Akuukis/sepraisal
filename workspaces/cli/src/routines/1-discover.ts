// tslint:disable:no-unsafe-any - because `response` is not typed.
// tslint:disable:object-literal-sort-keys member-ordering max-line-length
import { DB_NAME, DB_URL, IBlueprint, idFromHref, toMinSec, Work, Worker } from '@sepraisal/common'
import { Collection, MongoClient } from 'mongodb'
import * as pad from 'pad'
import * as scrapeIt from 'scrape-it'


/**
 * For first run, use `TYPE = 'totaluniquesubscribers'` and `MAX_PAGES = 1670`.
 * For second run, use `TYPE = 'mostrecent'` and `MAX_PAGES = 1670`.
 * Afterwards leave to `TYPE = 'mostrecent'` and `MAX_PAGES = 10` to run regularly.
 *
 * Notes:
 * 1. Mongo free 512MB is too small for infinite blueprints. For 512MB database I recommend to
 * regularly run only 500-700 pages of 'totaluniquesubscribers' only, and at 3kb thumbs (see 3rd script).
 * 2. In 2019 Q4, it's 2-5 pages of new blueprint per day.
 * 3. Note steam sorting algorithm - it works but it's not perfect!
 */
const TYPE = 'mostrecent'
const MAX_PAGES = 10  // MAX is 1670 due how steam workshop works.
const SKIP_PAGES = 0


export interface IDiscoverScrapeDatum {
    _id: number,
    title: string,
    authorId: number,
    authorTitle: string,
}

export interface IDiscoverScrapeData {
    items: IDiscoverScrapeDatum[]
}


const scrape = async (page: number): Promise<IDiscoverScrapeData> => {

    const url = `https://steamcommunity.com/workshop/browse/?appid=244850&requiredtags%5B0%5D=Blueprint&actualsort=$TYPE&browsesort=${TYPE}&p=${page}`

    // tslint:disable-next-line:no-object-literal-type-assertion no-any no-unused no-dead-store
    const {data, response} = await scrapeIt<IDiscoverScrapeData>(url, {
        items: {listItem: '.workshopItem', data: {
            _id: {selector: 'a:nth-child(1)', attr: 'data-publishedfileid', convert: Number},
            title: {selector: 'div.workshopItemTitle'},
            authorId: {selector: 'div.workshopItemAuthorName > a', attr: 'href', convert: idFromHref},
            authorTitle: {selector: 'div.workshopItemAuthorName > a'},
        }},
    } as any)  // tslint:disable-line:no-any

    return {
        ...data,
    }

}

let allIdsSet: Set<number>

type IWorkItem = [Collection<{_id: number}>, number]
const work: Work<IWorkItem> = async (collection: Collection<{_id: number}>, index: number) => {
    const data = await scrape(index)
    const newItems: IBlueprint[] = data.items
        .filter((item) => !allIdsSet.has(item._id))
        .map((item) => ({
            _id: item._id,
        }))

    if(newItems.length === 0) return

    newItems.forEach((item) => allIdsSet.add(item._id))  // Fix having the same blueprint on two pages.
    await collection.insertMany(newItems)
    const newIds = newItems.reduce((str, page) => `${str} ${page._id}`, '')
    const indexStr = pad(4, `#${index}`)
    console.info(`Page ${indexStr} (${data.items.length}) +${newItems.length} :${newIds}`)
}


export const main = async () => {

    const timer = Date.now()
    const client = await MongoClient.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    console.info('Successfully connected to server.')
    const db = client.db(DB_NAME)
    const collection = db.collection<{_id: number}>('blueprints')
    const docs = await collection.find().project({_id: true}).toArray()// .count()
    allIdsSet = new Set(docs.map((doc) => doc._id))
    const startCount = allIdsSet.size
    const cacheDuration = (Date.now() - timer) / 1000
    console.info(`Cached ${allIdsSet.size} ids in ${toMinSec(cacheDuration)}.`)

    const works: IWorkItem[] = []
    const errors: Error[] = []

    for(let index = SKIP_PAGES; index <= MAX_PAGES; index += 1) {
        works.push([collection, index])
    }

    const worker = Worker<IWorkItem>(work, errors)

    await Promise.all([
        worker(works, 0),
        worker(works, 1),
        worker(works, 2),
        worker(works, 3),
        worker(works, 4),
        worker(works, 5),
        worker(works, 6),
        worker(works, 7),
    ])

    const found = allIdsSet.size - startCount
    const checked = (MAX_PAGES - SKIP_PAGES) * 30
    console.info(`Errors (${errors.length}):`, errors)
    console.info(`Results: +${found} new blueprints out of ${checked} (${(found / checked * 100).toFixed(2)}%).`)
    console.info(`Total: ${startCount} + ${found} --> ${allIdsSet.size}`)
    console.info(`Discover finished in ${toMinSec((Date.now() - timer) / 1000)}.`)
    await client.close()

    process.exitCode = 0
    process.exit()
}
