import { DB_NAME, DB_URL, IBlueprint, idFromHref, timeout, toMinSec, VENDOR_MOD, Work, Worker } from '@sepraisal/common'
import cheerio = require('cheerio')
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import moment from 'moment'
import { Collection, MongoClient } from 'mongodb'
import pad from 'pad'
import { join } from 'path'
import { Omit } from 'utility-types'

import { QUERIES } from '../queries'
import { ensureSteamCmdLogin, prepareQuery, scrapeHtml, steamFetchHtml } from '../utils'


type IFlagParam = Omit<IBlueprint.ISteam, 'flagsRed' | 'flagsYellow' | 'flagsGreen'>
interface IProjection extends Pick<IBlueprint, '_id'> {
    steam: Pick<IBlueprint.ISteam, 'revision' | '_version'>
}

const reFind = (data: IFlagParam, regex: RegExp) => `${data.title}\n\n${data.description}`.toLowerCase().search(regex) !== -1
const flagIt = <T>(flag: T, check: (datum: IFlagParam) => boolean) => (datum: IFlagParam) => check(datum) ? flag : false

const flagItRed = [
    flagIt(IBlueprint.SteamFlagsRed.Broken, (datum) => reFind(datum, /(\[broken?\]|is broke)/)),
    flagIt(IBlueprint.SteamFlagsRed.Outdated, (datum) => reFind(datum, /(\[depreciated?\]|is depreciate|\[outdate?\]|is outdate|\[out.?of.?date\]|is out.?of.?date)/)),
    flagIt(IBlueprint.SteamFlagsRed.Obselete, (datum) => reFind(datum, /(\[obselete\]|is obselete)/)),
    flagIt(IBlueprint.SteamFlagsRed.OverTemMb, (datum) => datum.sizeMB > 10),
    flagIt(IBlueprint.SteamFlagsRed.PreSurvival, (datum) => moment(datum.updatedDate).isBefore(moment('2014-03-24'))),
    flagIt(IBlueprint.SteamFlagsRed.Private, (datum) => reFind(datum, /(\[private( use)?( only)?\]|is private( use)?( only)?)/)),
    flagIt(IBlueprint.SteamFlagsRed.Wip, (datum) => reFind(datum, /(\[wip\]|work in progress)/)),
]

const flagItYellow = [
    flagIt(IBlueprint.SteamFlagsYellow.Decommisioned, (datum) => reFind(datum, /(\[decommisioned?\]|is decommisione)/)),
    flagIt(IBlueprint.SteamFlagsYellow.NoImage, (datum) => datum._thumbName === null),
    flagIt(IBlueprint.SteamFlagsYellow.OverQuarterMb, (datum) => datum.sizeMB > 2.5),
    flagIt(IBlueprint.SteamFlagsYellow.PreOverhaul01Physics, (datum) => moment(datum.updatedDate).isBefore(moment('2017-11-17'))),
    flagIt(IBlueprint.SteamFlagsYellow.PreOverhaul02Wheels, (datum) => moment(datum.updatedDate).isBefore(moment('2018-02-02'))),
    flagIt(IBlueprint.SteamFlagsYellow.Unrevised, (datum) => datum.revision === 1),
    // flagIt(BlueprintSteamFlagsYellow.preOverhaul03MP, (d) => moment(d.updatedDate).isBefore(moment('2018-07-19'))),
]

const flagItGreen = [
    flagIt(IBlueprint.SteamFlagsGreen.BelowOneMb, (datum) => datum.sizeMB < 1),
    flagIt(IBlueprint.SteamFlagsGreen.Description, (datum) => datum.description.length > 140),
    flagIt(IBlueprint.SteamFlagsGreen.FiveStars, (datum) => datum.ratingStars === 5),
    flagIt(IBlueprint.SteamFlagsGreen.PostOverhaul05LCDs, (datum) => moment(datum.updatedDate).isAfter(moment('2019-04-08'))),  // TODO
    flagIt(IBlueprint.SteamFlagsGreen.RevisedInMonth, (datum) => moment().diff(datum.updatedDate, 'days') < 31),
    flagIt(IBlueprint.SteamFlagsGreen.RevisedInYear, (datum) => moment().diff(datum.updatedDate, 'days') < 365),
]

const VENDOR_ID_TO_MOD = {
    1135960: VENDOR_MOD.ECONOMY,
    1241550: VENDOR_MOD.FROSTBITE,
    1049790: VENDOR_MOD.DECORATIVE_1,
    1167910: VENDOR_MOD.DECORATIVE_2,
    1307680: VENDOR_MOD.SPARKSOFTHEFUTURE,
    1374610: VENDOR_MOD.SCRAPRACEPACK,
    1475830: VENDOR_MOD.WARFARE_1,
    1676100: VENDOR_MOD.INDUSTRIAL,
    1783760: VENDOR_MOD.WARFARE_2,
    1958640: VENDOR_MOD.GRIDAIPACK,
    2504720: VENDOR_MOD.DECORATIVE_3,
    2914120: VENDOR_MOD.SIGNALS,
    3066290: VENDOR_MOD.CONTACT,
    3601770: VENDOR_MOD.FIELDWORK,
    3858380: VENDOR_MOD.APEXSURVIVALPACK,
    4116960: VENDOR_MOD.CORESYSTEMSPACK,
    4502100: VENDOR_MOD.ECONOMY2PACK,
    4835530: VENDOR_MOD.PROSPERITYPACK,
}

const thumbIdConvert = (url: string) => url.includes('default_image') ? null : `${url.split('/')[4]}-${url.split('/')[5]}`
const commaNumber = (rawNumber: string) => Number(rawNumber.replace(',', ''))
const authorIdConvert = (input: string) => (input.match(/com\/(.*)/) || [''])[1]
const ratingStarsConvert = (input: string) => input.includes('not-yet') ? null : Number((input.match(/(\d)-star_large\.png/) || [null])[1])
const ratingCountConvert = (input: string) => input === '' ? null : Number((input.replace(',', '').match(/(\d+(\.\d+)?)/) || [null])[1])
const suffixConvert = (input: string) => Number((input.replace(',', '').match(/(\d+(\.\d+)?)/) || [''])[1])
const dlcsConvert = (input: string): VENDOR_MOD => VENDOR_ID_TO_MOD[Number(input.split('/').pop())]

const dateConvert = (steamDate: string) => {
    if(steamDate === '') return null

    const parsed = moment(steamDate, steamDate.includes(',') ? 'DD MMM, YYYY @ h:ma' : 'DD MMM @ h:ma', true)
    if(!parsed.isValid()) return null

    return parsed.utc().toDate()  // Steam shows local time, so convert back to UTC.
}

const decodeHtmlEntity = (input: string): string =>
    input
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, '\'')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')

const parseTitleFromHtml = (html: string): string | null => {
    const ogTitle = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i)
    if(ogTitle && ogTitle[1]) return decodeHtmlEntity(ogTitle[1]).replace(/^Steam Workshop::/, '').trim()

    const titleTag = html.match(/<title>\s*([^<]+?)\s*<\/title>/i)
    if(titleTag && titleTag[1]) return decodeHtmlEntity(titleTag[1]).replace(/^Steam Workshop::/, '').trim()

    return null
}

const stripHtml = (input: string): string =>
    decodeHtmlEntity(input.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim()

const parseDetailStatDatesFromHtml = (html: string): Date[] =>
    [...html.matchAll(/<div class="detailsStatRight">([\s\S]*?)<\/div>/g)]
        .map((match) => stripHtml(match[1]))
        .map((value) => dateConvert(value))
        .filter((value): value is Date => value instanceof Date)

const textOrNull = (value: string | null | undefined): string | null => {
    if(typeof value !== 'string') return null
    const trimmed = value.trim()

    return trimmed === '' ? null : trimmed
}

const firstTextNode = ($element: Cheerio): string | null => {
    const node = $element.contents().toArray().find((child) => child.type === 'text')
    if(!node || typeof node.data !== 'string') return null

    return textOrNull(node.data)
}

const SCRAPE_DEBUG_ENABLED = /^(1|true|yes)$/i.test(process.env.crawler_debug_scrape || '')

const writeScrapeDebugDump = (id: number, payload: unknown): void => {
    if(!SCRAPE_DEBUG_ENABLED) return

    const debugDir = join(process.cwd(), 'debug', 'scrape')
    if(!existsSync(debugDir)) mkdirSync(debugDir, {recursive: true})
    const debugPath = join(debugDir, `${id}.json`)
    writeFileSync(debugPath, JSON.stringify(payload, null, 2), 'utf8')
}

const scrape = async (id: number): Promise<IBlueprint.ISteam> => {
    const url = `https://steamcommunity.com/sharedfiles/filedetails/?id=${id}`
    const html = await steamFetchHtml(url)

    type IScrapeSteamDataOmits =
        | '_error'
        | '_errorDetails'
        | '_revision'
        | '_updated'
        | '_version'
        | 'activityMax'
        | 'activityTotal'
        | 'exposureMax'
        | 'exposureTotal'
        | 'popularity'
        | 'authorsCount'
        | 'collectionsCount'
        | 'DLCsCount'
        | 'modsCount'
    type IScrapeSteamData = Omit<IFlagParam, IScrapeSteamDataOmits>

    const $ = cheerio.load(html)
    const detailsStatRight = $('.detailsStatsContainerRight .detailsStatRight').toArray()
        .map((element) => textOrNull($(element).text()))
        .filter((value): value is string => value !== null)
    const statsRows = $('.stats_table tr').toArray().map((element) =>
        $(element).find('td').toArray().map((td) => textOrNull($(td).text()) || '')
    )
    const authors = $('div.creatorsBlock > div.friendBlock').toArray().map((element) => {
        const block = $(element)
        const href = textOrNull(block.find('.friendBlockLinkOverlay').attr('href'))
        const authorTitle = firstTextNode(block.find('.friendBlockContent'))

        return href && authorTitle ? {
            id: authorIdConvert(href),
            title: authorTitle,
        } : null
    }).filter((value): value is NonNullable<typeof value> => value !== null)
    const collections = $('div.parentCollections > div.parentCollection').toArray().map((element) => {
        const item = $(element)
        const onclick = textOrNull(item.attr('onclick'))
        const titleValue = textOrNull(item.find('.parentCollectionTitle').text())

        return onclick && titleValue ? {
            id: idFromHref(onclick),
            title: titleValue,
        } : null
    }).filter((value): value is NonNullable<typeof value> => value !== null)
    const dlcs = $('.requiredDLCContainer > .requiredDLCItem > a').toArray().map((element) => {
        const href = textOrNull($(element).attr('href'))

        return href ? dlcsConvert(href) : null
    }).filter((value): value is NonNullable<typeof value> => value !== null)
    const mods = $('#RequiredItems > a').toArray().map((element) => {
        const item = $(element)
        const href = textOrNull(item.attr('href'))
        const titleValue = textOrNull(item.find('.requiredItem').text())

        return href && titleValue ? {
            id: idFromHref(href),
            title: titleValue,
        } : null
    }).filter((value): value is NonNullable<typeof value> => value !== null)
    const dataRaw: Partial<IScrapeSteamData> = {
        title: textOrNull($('.workshopItemTitle').first().text()) || undefined,
        authors,
        ratingStars: ratingStarsConvert(textOrNull($('.ratingSection img').first().attr('src')) || ''),
        ratingCount: ratingCountConvert(textOrNull($('.ratingSection .numRatings').first().text()) || ''),
        commentCount: (() => {
            const value = textOrNull($('a.sectionTab.comments .tabCount').first().text())
            return value !== null ? commaNumber(value) : undefined
        })(),
        _thumbName: thumbIdConvert(textOrNull($('#previewImageMain,#previewImage').first().attr('src')) || 'default_image'),
        sizeMB: (() => {
            const value = detailsStatRight[0]
            return value ? suffixConvert(value) : undefined
        })(),
        postedDate: (() => {
            const value = detailsStatRight[1]
            return value ? dateConvert(value) || undefined : undefined
        })(),
        updatedDate: (() => {
            const value = detailsStatRight[2]
            return value ? dateConvert(value) || undefined : undefined
        })(),
        revision: (() => {
            const value = textOrNull($('.detailsStatNumChangeNotes').first().text())
            return value ? suffixConvert(value) : undefined
        })(),
        mods,
        DLCs: dlcs,
        collections,
        visitorCount: (() => {
            const value = statsRows[0] && statsRows[0][0]
            return value ? commaNumber(value) : undefined
        })(),
        subscriberCount: (() => {
            const value = statsRows[1] && statsRows[1][0]
            return value ? commaNumber(value) : undefined
        })(),
        favoriteCount: (() => {
            const value = statsRows[2] && statsRows[2][0]
            return value ? commaNumber(value) : undefined
        })(),
        description: $('.workshopItemDescription').first().html() || undefined,
    }

    const detailStatDates = parseDetailStatDatesFromHtml(html)
    const title = typeof dataRaw.title === 'string' ? dataRaw.title : parseTitleFromHtml(html)
    const description = typeof dataRaw.description === 'string' ? dataRaw.description : ''
    const commentCount = typeof dataRaw.commentCount === 'number' ? dataRaw.commentCount : 0
    const favoriteCount = typeof dataRaw.favoriteCount === 'number' ? dataRaw.favoriteCount : 0
    const revision = typeof dataRaw.revision === 'number' ? dataRaw.revision : 1
    const sizeMB = typeof dataRaw.sizeMB === 'number' ? dataRaw.sizeMB : 0
    const subscriberCount = typeof dataRaw.subscriberCount === 'number' ? dataRaw.subscriberCount : 0
    const visitorCount = typeof dataRaw.visitorCount === 'number' ? dataRaw.visitorCount : 0
    const postedDate = dataRaw.postedDate instanceof Date ? dataRaw.postedDate : detailStatDates[0]
    const updatedDate = dataRaw.updatedDate instanceof Date ? dataRaw.updatedDate : detailStatDates[1] || postedDate
    const thumbName = typeof dataRaw._thumbName === 'string' || dataRaw._thumbName === null ? dataRaw._thumbName : null
    const ratingStars = typeof dataRaw.ratingStars === 'number' ? dataRaw.ratingStars : null
    const storedRatingCount = typeof dataRaw.ratingCount === 'number' ? dataRaw.ratingCount : null
    const defaultedFields = [
        ...(Array.isArray(dataRaw.authors) ? [] : ['authors']),
        ...(Array.isArray(dataRaw.collections) ? [] : ['collections']),
        ...(Array.isArray(dataRaw.DLCs) ? [] : ['DLCs']),
        ...(Array.isArray(dataRaw.mods) ? [] : ['mods']),
        ...(typeof dataRaw.title === 'string' ? [] : title ? ['title'] : []),
        ...(typeof dataRaw.description === 'string' ? [] : ['description']),
        ...(typeof dataRaw.commentCount === 'number' ? [] : ['commentCount']),
        ...(typeof dataRaw.favoriteCount === 'number' ? [] : ['favoriteCount']),
        ...(typeof dataRaw.revision === 'number' ? [] : ['revision']),
        ...(typeof dataRaw.sizeMB === 'number' ? [] : ['sizeMB']),
        ...(typeof dataRaw.subscriberCount === 'number' ? [] : ['subscriberCount']),
        ...(typeof dataRaw.visitorCount === 'number' ? [] : ['visitorCount']),
        ...(dataRaw.postedDate instanceof Date ? [] : postedDate instanceof Date ? ['postedDate'] : []),
        ...(dataRaw.updatedDate instanceof Date ? [] : updatedDate instanceof Date ? ['updatedDate'] : []),
        ...((typeof dataRaw._thumbName === 'string' || dataRaw._thumbName === null) ? [] : ['_thumbName']),
        ...(typeof dataRaw.ratingStars === 'number' || dataRaw.ratingStars === null ? [] : ['ratingStars']),
        ...(typeof dataRaw.ratingCount === 'number' || dataRaw.ratingCount === null ? [] : ['ratingCount']),
    ]
    const requiredFailures = [
        ...((typeof title === 'string' && title !== '') ? [] : ['title']),
        ...(postedDate instanceof Date ? [] : ['postedDate']),
    ]

    writeScrapeDebugDump(id, {
        id,
        url,
        parsed: dataRaw,
        derived: {
            titleFromHtml: parseTitleFromHtml(html),
            detailStatDates,
        },
        normalized: {
            id,
            title,
            authors,
            description,
            _thumbName: thumbName,
            postedDate,
            updatedDate,
            sizeMB,
            revision,
            mods,
            DLCs: dlcs,
            collections,
            ratingStars,
            ratingCount: storedRatingCount,
            commentCount,
            visitorCount,
            subscriberCount,
            favoriteCount,
        },
        defaultedFields,
        requiredFailures,
    })

    if(typeof title !== 'string' || title === '') throw new Error('Field title failed to scrape.')
    if(!(postedDate instanceof Date)) throw new Error('Field postedDate failed to scrape.')


    const ratingCount = storedRatingCount !== null ? storedRatingCount : 0
    const exposureMax = Math.max(visitorCount, subscriberCount)
    const exposureTotal = visitorCount + subscriberCount
    const activityMax = Math.max(ratingCount, commentCount, favoriteCount)
    const activityTotal = ratingCount + commentCount + favoriteCount
    const popularity = subscriberCount / Math.sqrt(Math.min(30, moment().diff(postedDate, 'd')))
    const authorsCount = authors.length
    const collectionsCount = collections.length
    const DLCsCount = dlcs.length
    const modsCount = mods.length

    const dataForFlags: IFlagParam = {
        id,
        title,
        authors,
        description,
        _thumbName: thumbName,
        _updated: new Date(),
        postedDate,
        updatedDate,  // UpdatedDate doesn't exist if posted but not updated.
        sizeMB,
        revision,
        mods,
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */  // Hack around enforced object due scraping.
        DLCs: dlcs,
        collections,
        ratingStars,
        ratingCount: storedRatingCount,
        commentCount,
        visitorCount,
        subscriberCount,
        favoriteCount,

        _revision: null,
        _version: IBlueprint.VERSION.steam,
        activityMax,
        activityTotal,
        exposureMax,
        exposureTotal,
        popularity,

        authorsCount,
        collectionsCount,
        DLCsCount,
        modsCount,
    }

    return {
        ...dataForFlags,

        flagsRed:    flagItRed.map((fn) => fn(dataForFlags)).filter((datum): datum is IBlueprint.SteamFlagsRed    => datum !== false),
        flagsYellow: flagItYellow.map((fn) => fn(dataForFlags)).filter((datum): datum is IBlueprint.SteamFlagsYellow => datum !== false),
        flagsGreen:  flagItGreen.map((fn) => fn(dataForFlags)).filter((datum): datum is IBlueprint.SteamFlagsGreen  => datum !== false),
    }

}

const removeRemoved = async (collection: Collection<IBlueprint>, doc: IProjection, prefix: string): Promise<boolean> => {
    const url = `https://steamcommunity.com/sharedfiles/filedetails/?id=${doc._id}`
    const html = await steamFetchHtml(url).catch((err: Error) => {
        if(String(err.message).includes('Steam access denied')) {
            console.warn(`${prefix}Steam access denied while checking removal state.`)
            return ''
        }
        throw err
    })
    if(html === '') return true

    const looksLikeWorkshopPage =
        html.includes('class="workshopItemTitle"')
        || html.includes('<title>Steam Workshop::')
        || html.includes(`sharedfiles/filedetails/?id=${doc._id}`)
    if(looksLikeWorkshopPage) return false

    const dataRaw = scrapeHtml<{
        adultGate?: boolean,
        removed?: boolean,
        breadcumb?: string,
        workshopTitle?: string,
    }>(html, {
        adultGate: {selector: '.adult_content_age_gate', attr: 'class', convert: (str) => str === 'adult_content_age_gate'},
        breadcumb: {selector: '.breadcrumbs > a:nth-child(1)'},
        removed: {selector: '#message > h3', convert: (str) => str.includes('There was a problem accessing the item.')},
        workshopTitle: {selector: '.workshopItemTitle'},
    })
    const data = dataRaw && typeof dataRaw === 'object' ? dataRaw : {}
    const breadcumb = typeof data.breadcumb === 'string' ? data.breadcumb : ''
    const removed = data.removed === true
    const adultGate = data.adultGate === true
    const workshopTitle = typeof data.workshopTitle === 'string' ? data.workshopTitle : ''

    switch(breadcumb) {
        case('Space Engineers'): {
            return false  // not to remove.
        }
        case(''): {
            if(workshopTitle !== '') return false
            if(removed) {
                try {
                    await collection.deleteOne({_id: doc._id})
                    console.info(`${prefix}removed from workshop, deleted.`)
                } catch(err) {
                    console.warn(`${prefix}removed from workshop, but failed to delete.`)
                }
            } else if (adultGate) {
                console.warn(`${prefix}has adult game, since when SE has that?`)
            } else {
                dumpSuspiciousFallbackAndExit(doc._id, html, prefix)
            }

            return true
        }
        default: {
            await collection.deleteOne({_id: doc._id})
            console.warn(`${prefix}Cleanup from "${breadcumb}".. how did it get here?`)

            return true
        }
    }

}

const scraped = new Map<number, [number | null, number]>()
let suspiciousFallbackDumped = false

const dumpSuspiciousFallbackAndExit = (id: number, html: string, prefix: string): never => {
    if(!suspiciousFallbackDumped) {
        suspiciousFallbackDumped = true
        const debugPath = '/root/broke.html'
        writeFileSync(debugPath, html, 'utf8')
        console.error(`${prefix}Suspicious fallback page dumped to ${debugPath}. Exiting.`)
    }

    process.exit(1)
}

type IWorkItem = [Collection, IProjection, number]
const work: Work<IWorkItem> = async (collection: Collection, doc: IProjection, index: number): Promise<void> => {
    const prefix = `#${pad(String(index), 5)} - ${pad(String(doc._id), 10)}: `

    let steam: IBlueprint.ISteam
    try {
        steam = await timeout(SCRAPE_TIMEOUT_SECONDS, scrape(doc._id))
    } catch(err) {
        try {
            if(!await timeout(SCRAPE_TIMEOUT_SECONDS, removeRemoved(collection, doc, prefix))) console.error(`${prefix}legit error: ${err instanceof Error ? err.message : err}`)
        } catch(err2) {
            console.error(`${prefix}Failed to scrape: ${err2 instanceof Error ? err2.message : err2}`)
        }

        return
    }

    try {
        await collection.updateOne({ _id: doc._id }, { $set: {steam}})

        if(!('steam' in doc)) {
            console.info(`${prefix}found new blueprint at v${steam.revision}.`)
        } else if(steam.revision === doc.steam.revision) {
            console.info(`${prefix}bumped v${doc.steam.revision}.`)
        } else {
            console.info(`${prefix}updated from v${doc.steam.revision} to v${steam.revision}.`)
        }
        scraped.set(doc._id, ['steam' in doc ? doc.steam.revision : null, steam.revision])
    } catch(err) {
        console.error(`${prefix}Error: ${err.errmsg}`)
    }
}


export const main = async (): Promise<void> => {


    const timer = Date.now()
    await ensureSteamCmdLogin()
    const client = await MongoClient.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    console.info('Successfully connected to server.')
    const db = client.db(DB_NAME)
    const collection = db.collection<IProjection>('blueprints')

    const works: IWorkItem[] = []
    const errors: Error[] = []

    const query = prepareQuery<IProjection>(QUERIES.pendingScrape)

    const docs = await collection
        .find(query)
        // .limit(1000)
        // .sort({subscriberCount: -1})
        .project({
            '_id': true,
            'steam.revision': true,
            'steam._version': true,
        })
        .toArray()

    //// For debugging.
    // const docs = [{
    //     _id: 1643843099,
    //     steam: {
    //         revision: 1,
    //         _version: 1,
    //     }
    // }]
    console.info(`Scraping ${docs.length} blueprints...`)

    for(const [i, doc] of docs.entries()) {
        works.push([collection, doc, i])
    }

    const worker = Worker<IWorkItem>(work, errors)

    await Promise.all(
        Array.from({length: SCRAPE_WORKER_COUNT}, (_, i) => worker(works, i))
    )

    /* eslint-disable @typescript-eslint/no-unused-vars */
    const found = [...scraped.values()]
        .filter(([prev, curr]) => prev !== null)
        .map(([prev, curr]) => curr)
    const bumped = [...scraped.values()]
        .filter(([prev, curr]) => prev === curr)
        .map(([prev, curr]) => prev)
    const v1 = [...scraped.values()].filter(([prev, curr]) => curr === 1).length
    const updated = [...scraped.values()]
        .filter((pair): pair is [number, number] => pair[0] !== null)
        .filter(([prev, curr]) => prev < curr)
        .map(([prev, curr]) => curr - prev)
    console.info(`Errors (${errors.length}):`, errors)
    console.info(`Results: ${scraped.size} total: ${found.length} new, ${updated.length} updated, ${bumped.length} bumped.`)
    console.info(`Stats: ${(updated.length / scraped.size * 100).toFixed(2)}% updated, average by ${updated.reduce((sum, val) => sum + val, 0)}.`)
    console.info(`Stats: ${v1} are v1 (${(v1 / scraped.size * 100).toFixed(2)}%).`)
    console.info(`Scrape finished in ${toMinSec((Date.now() - timer) / 1000)}.`)

    await client.close()
    process.exitCode = 0
    process.exit()


}
const SCRAPE_TIMEOUT_SECONDS = 120
const SCRAPE_WORKER_COUNT = 1
