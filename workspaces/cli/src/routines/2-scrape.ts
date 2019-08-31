import { DB_NAME, DB_URL, IBlueprint, idFromHref, timeout, toMinSec, Work, Worker } from '@sepraisal/common'
import * as moment from 'moment'
import { Collection, MongoClient } from 'mongodb'
import * as pad from 'pad'
import * as scrapeIt from 'scrape-it'
import { Omit } from 'utility-types'

import { QUERIES } from '../queries'

// tslint:disable:no-unsafe-any - because `response` is not typed.
// tslint:disable:object-literal-sort-keys member-ordering max-line-length object-shorthand-properties-first

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

// tslint:disable: strict-boolean-expressions
export const thumbIdConvert = (url: string) => url.includes('default_image') ? null : `${url.split('/')[4]}-${url.split('/')[5]}`
export const commaNumber = (rawNumber: string) => Number(rawNumber.replace(',', ''))
export const authorIdConvert = (input: string) => (input.match(/com\/(.*)/) || [''])[1]
export const authorTitleConvert = (input: string) => (input.match(/(.*?)\r/) || [''])[1]
export const ratingStarsConvert = (input: string) => input.includes('not-yet') ? null : Number((input.match(/(\d)-star_large\.png/) || [null])[1])
export const ratingCountConvert = (input: string) => input === '' ? null : Number((input.replace(',', '').match(/(\d+(\.\d+)?)/) || [null])[1])
export const suffixConvert = (input: string) => Number((input.replace(',', '').match(/(\d+(\.\d+)?)/) || [''])[1])
// tslint:enable: strict-boolean-expressions
export const dateConvert = (steamDate?: string) => {
    if(typeof steamDate !== 'string') return null

    return steamDate.includes(',') ?
        moment(`${steamDate} +3:00`, 'DD MMM, YYYY @ h:ma ZZ').toDate()
        :
        moment(`${steamDate} +3:00 2019`, 'DD MMM @ h:ma ZZ 2019').toDate()
}

const scrape = async (id: number): Promise<IBlueprint.ISteam> => {
    const url = `https://steamcommunity.com/sharedfiles/filedetails/?id=${id}`

    type IScrapeSteamDataOmits =
        | '_error'
        | '_errorDetails'
        | '_revision'
        | '_updated'
        | '_version'
        | 'activityMax'
        | 'activityTotal'
        | 'author'
        | 'exposureMax'
        | 'exposureTotal'
        | 'popularity'
    interface IScrapeSteamData extends Omit<IFlagParam, IScrapeSteamDataOmits> {
        // _id: number,
        authorId: number,
        authorTitle: string,
    }

    // tslint:disable-next-line:no-object-literal-type-assertion
    const {data: dataRaw} = await scrapeIt<IScrapeSteamData>(url, {
        id: {selector: 'a.sectionTab:nth-child(1)', attr: 'href', convert: idFromHref},
        title: {selector: '.workshopItemTitle'},
        authorId: {selector: '.friendBlockLinkOverlay', attr: 'href', convert: authorIdConvert},
        authorTitle: {selector: '.friendBlockContent', convert: authorTitleConvert},
        ratingStars: {selector: '.ratingSection img', attr: 'src', convert: ratingStarsConvert},
        ratingCount: {selector: '.ratingSection .numRatings', convert: ratingCountConvert},
        commentCount: {selector: 'a.sectionTab:nth-child(3) > span:nth-child(1) > span:nth-child(1)', convert: commaNumber},
        _thumbName: {selector: '#previewImageMain,#previewImage', attr: 'src', convert: thumbIdConvert},
        sizeMB: {selector: 'div.detailsStatRight:nth-child(1)', convert: suffixConvert},
        postedDate: {selector: 'div.detailsStatRight:nth-child(2)', convert: dateConvert},
        updatedDate: {selector: 'div.detailsStatRight:nth-child(3)', convert: dateConvert},
        revision: {selector: '.detailsStatNumChangeNotes', convert: suffixConvert},
        mods: {listItem: '#RequiredItems > a', data: {
            id: {attr: 'href', convert: idFromHref},
            title: {selector: '.requiredItem'},
        }},
        collections: {listItem: 'div.parentCollections > div.parentCollection', data: {
            id: {attr: 'onclick', convert: idFromHref},
            title: {selector: '.parentCollectionTitle'},
        }},
        visitorCount: {selector: '.stats_table tr:nth-child(1) > td:nth-child(1)', convert: commaNumber},
        subscriberCount: {selector: '.stats_table tr:nth-child(2) > td:nth-child(1)', convert: commaNumber},
        favoriteCount: {selector: '.stats_table tr:nth-child(3) > td:nth-child(1)', convert: commaNumber},
        description: {selector: '.workshopItemDescription', how: 'html'},
    } as Record<keyof IScrapeSteamData, scrapeIt.ScrapeOptions>)

    const ratingCount = (dataRaw.ratingCount !== null ? dataRaw.ratingCount : 0)
    const exposureMax = Math.max(dataRaw.visitorCount, dataRaw.subscriberCount)
    const exposureTotal = dataRaw.visitorCount + dataRaw.subscriberCount
    const activityMax = Math.max(ratingCount, dataRaw.commentCount, dataRaw.favoriteCount)
    const activityTotal = ratingCount + dataRaw.commentCount + dataRaw.favoriteCount
    const popularity = dataRaw.subscriberCount / Math.sqrt(Math.min(30, moment().diff(dataRaw.postedDate, 'd')))

    const dataForFlags: IFlagParam = {
        id,
        title: dataRaw.title,
        author: {
            id: dataRaw.authorId,
            title: dataRaw.authorTitle,
        },
        description: dataRaw.description,
        _thumbName: dataRaw._thumbName,
        _updated: new Date(),
        postedDate: dataRaw.postedDate,
        updatedDate: dataRaw.updatedDate,
        sizeMB: dataRaw.sizeMB,
        revision: dataRaw.revision,
        mods: dataRaw.mods,
        collections: dataRaw.collections,
        ratingStars: dataRaw.ratingStars,
        ratingCount: dataRaw.ratingCount,
        commentCount: dataRaw.commentCount,
        visitorCount: dataRaw.visitorCount,
        subscriberCount: dataRaw.subscriberCount,
        favoriteCount: dataRaw.favoriteCount,

        _revision: null,
        _version: 1,
        activityMax,
        activityTotal,
        exposureMax,
        exposureTotal,
        popularity,
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
    // tslint:disable-next-line:no-object-literal-type-assertion no-any
    const {data} = await scrapeIt<{adultGate: boolean, removed: boolean, breadcumb: string}>(url, {
        adultGate: {selector: '.adult_content_age_gate', attr: 'class', convert: (str) => str === 'adult_content_age_gate'},
        breadcumb: {selector: '.breadcrumbs > a:nth-child(1)'},
        removed: {selector: '#message > h3:nth-child(3)', convert: (str) => str.includes('It may have been removed by the author.')},
    })

    switch(data.breadcumb) {
        case('Space Engineers'): {
            return false  // not to remove.
        }
        case(''): {
            if(data.removed) {
                try {
                    await collection.deleteOne({_id: doc._id})
                    console.info(`${prefix}removed from workshop, deleted.`)
                } catch(err) {
                    console.warn(`${prefix}removed from workshop, but failed to delete.`)
                }
            } else if (data.adultGate) {
                console.warn(`${prefix}has adult game, since when SE has that?`)
            } else {
                console.warn(`${prefix}Suspicious:`, data)
            }

            return true
        }
        default: {
            await collection.deleteOne({id: doc._id})
            console.warn(`${prefix}Cleanup from "${data.breadcumb}".. how did it get here?`)

            return true
        }
    }

}

const scraped = new Map<number, [number | null, number]>()

type IWorkItem = [Collection, IProjection, number]
const work: Work<IWorkItem> = async (collection: Collection, doc: IProjection, index: number): Promise<void> => {
    const prefix = `#${pad(String(index), 5)} - ${pad(String(doc._id), 10)}: `

    let steam: IBlueprint.ISteam
    try {
        steam = await timeout(9, scrape(doc._id))
    } catch(err) {
        try {
            if(!await timeout(9, removeRemoved(collection, doc, prefix))) console.error(`${prefix}legit error: ${err}`)
        } catch(err2) {
            console.error(`${prefix}Failed to scrape.`)
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


export const main = async () => {


    const timer = Date.now()
    const client = await MongoClient.connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    console.info('Successfully connected to server.')
    const db = client.db(DB_NAME)
    const collection = db.collection<IProjection>('blueprints')

    const works: IWorkItem[] = []
    const errors: Error[] = []

    const docs = await collection
        .find(QUERIES.pendingScrape)
        // .limit(1000)
        // .sort({subscriberCount: -1})
        .project({
            '_id': true,
            'steam.revision': true,
            'steam._version': true,
        })
        .toArray()
    console.info(`Scraping ${docs.length} blueprints...`)

    for(const [i, doc] of docs.entries()) {
        works.push([collection, doc, i])
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

    // tslint:disable:no-unused
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
