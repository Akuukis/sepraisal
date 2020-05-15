import { getApiUrl, ObservableMap } from '@sepraisal/common'
import { IFind } from '@sepraisal/common/lib/classificator/Class'
import { action, autorun, computed, IReactionDisposer, observable, runInAction } from 'mobx'

import {
    Card,
    CardStatus,
    getPresetTitle as getPresetTitleReexport,
    IBpProjectionCard,
    ICard,
    PRESET as PRESET_REEXPORT,
    QueryFindBuilder,
} from '../models'
import { PiwikStore } from './PiwikStore'

const cardProjection: {[key in Exclude<keyof IBpProjectionCard, '_id'>]: {[key2 in keyof IBpProjectionCard[key]]: true}} = {
    classes: {
        _error: true,
        _revision: true,
        _version: true,
    },
    sbc: {
        _error: true,
        _revision: true,
        _version: true,
        blockCount: true,
        blockMass: true,
        blockPCU: true,
        blockTime: true,
        componentTime: true,
        flagsGreen: true,
        flagsRed: true,
        flagsYellow: true,
        gridSize: true,
        ingotTime: true,
        oreVolume: true,
    },
    steam: {
        _error: true,
        _thumbName: true,
        _updated: true,
        _version: true,
        author: true,
        collections: true,
        flagsGreen: true,
        flagsRed: true,
        flagsYellow: true,
        id: true,
        postedDate: true,
        ratingCount: true,
        ratingStars: true,
        revision: true,
        subscriberCount: true,
        title: true,
        updatedDate: true,
    },
    thumb: {
        _error: true,
        _revision: true,
        _version: true,
        webp: true,
    },
}

const projection = encodeURIComponent(JSON.stringify(cardProjection))

export const PRESET = PRESET_REEXPORT

export const getPresetTitle = getPresetTitleReexport

interface IBrowserStoreSort {
    [field: string]: -1 | 1
}

const sortFindAnd = ($and: object[]) => {
    const clone = [...$and]

    return clone.sort((a, b) => {
        const aKey = Object.keys(a).pop()
        const bKey = Object.keys(b).pop()

        if(aKey === undefined) return -1
        if(bKey === undefined) return 1

        return aKey < bKey ? 1 : -1
    })
}

// tslint:disable-next-line: min-class-cohesion
export class CardStore {
    public readonly querryFindBuilder = new QueryFindBuilder()

    @computed public get find(): IFind { return this.querryFindBuilder.find }
    @computed public get selectedPreset() { return this.querryFindBuilder.selectedPreset }

    @computed public get sort() { return this._sort }
    public set sort(value: IBrowserStoreSort) {
        this._sort = value
    }

    public static defaultSortOrder: -1 | 1 = -1
    public static sortFindAnd = sortFindAnd

    @observable public autoQuerry = true
    @observable public cards: ObservableMap<ICard<CardStatus.ok>> = new ObservableMap()
    @observable public cardsPerPage = 12
    @observable public count: null | number = null

    @observable protected _sort: IBrowserStoreSort = {'steam.subscriberCount': -1}
    protected disposers: IReactionDisposer[] = []
    private piwikStore: PiwikStore
    private abortController: AbortController | null = null

    public constructor(piwikStore: PiwikStore) {
        this.piwikStore = piwikStore
        this.disposers.push(autorun(
            () => JSON.stringify(this.find) && this.fetch(),
            {
                name: `${__filename}: autorun(query)`,
                delay: 400,
            }
        ))
    }

    public deconstructor() {
        for(const disposer of this.disposers) disposer()
    }

    @action public async nextPage() {
        const skip = this.cards.size
        const limit = this.cardsPerPage
        try {
            const timer = Date.now()

            const res = await fetch(getApiUrl(this.find, cardProjection, this.sort, limit, skip))
            const {count, docs} = await res.json() as {count: number, docs: IBpProjectionCard[] }

            // TODO: handle non-ok cards
            const cards = docs
                .map<[number, Card<CardStatus.ok>]>((doc) => [doc._id, new Card(doc)])
                .filter(([id, card]) => card.isStatus(CardStatus.praisedOnce))

            runInAction(`${__filename}: .nextPage()`, () => this.cards.merge(cards))

            this.piwikStore.push([
                'trackEvent',
                'load-time',
                this.selectedPreset,
                this.selectedPreset !== 'custom' ? undefined : this.querryFindBuilder.findStringified,
                (Date.now() - timer) / 1000,
            ])

            return {count, limit, skip}
        } catch(err) {
            console.error(err)

            return {count: 0, limit, skip}
        }
    }

    private fetch = async () => {
        try {
            const timer = Date.now()

            runInAction(`${__filename}: .querry(1/2)`, () => {
                this.count = null
                this.cards.replace([])
            })

            if(this.abortController) this.abortController.abort()
            this.abortController = new AbortController()
            const res = await fetch(
                    getApiUrl(this.find, cardProjection, this.sort, this.cardsPerPage),
                    {signal: this.abortController.signal}
                )
            if(res.status !== 200) throw new Error(`Backend error: ${await res.text()}`)
            const {count, docs} = await res.json() as {count: number, docs: IBpProjectionCard[]}

            // TODO: handle non-ok cards
            const cards = docs
                .map<[number, Card<CardStatus.ok>]>((doc) => [doc._id, new Card(doc)])
                .filter(([id, card]) => card.isStatus(CardStatus.praisedOnce))

            runInAction(`${__filename}: .querry(2/2)`, () => {
                this.count = count
                this.cards.replace(cards)
            })

            // this.piwikStore.push([
            //     'trackEvent',
            //     'selected-preset',
            //     this.selectedPreset,
            //     this.selectedPreset !== 'custom' ? undefined : this.findStringified,
            //     this.count,
            // ])

            // tslint:disable-next-line: no-commented-code
            // if(this.selectedPreset === 'custom') {
            //     for(const filter of this.find.$and) {
            //         // tslint:disable-next-line: no-non-null-assertion
            //         const [filterName, filterValue] = Object.entries(filter).shift()!
            //         this.piwikStore.push([
            //             'trackEvent',
            //             'custom-filter',
            //             filterName,
            //             JSON.stringify(filterValue),
            //         ])
            //     }
            // }

            if(typeof this.find.$text?.$search === 'string') {
                this.piwikStore.push([
                    'trackSiteSearch',
                    this.find.$text?.$search,
                    this.selectedPreset,
                    this.count,
                ])
            }

            this.piwikStore.push([
                'trackEvent',
                'load-time',
                this.selectedPreset,
                this.selectedPreset !== 'custom' ? undefined : this.querryFindBuilder.findStringified,
                (Date.now() - timer) / 1000,
            ])
        } catch(err) {
            if((err as Error).name === 'AbortError') {
                // Don't report aborted fetches as failed.
                console.log(`Previous fetch was aborted due changes in the query.`)

                return
            }

            console.error(err)

            runInAction(`${__filename}: .querry(catch)`, () => {
                this.count = -1
                this.cards.replace([])
            })
        }
    }

    @action public setFind(diff: Partial<IFind>) {
        return this.querryFindBuilder.setFind(diff)
    }
}
