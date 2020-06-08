import { ObservableMap } from '@sepraisal/common'
import { autorun, computed, IReactionDisposer, observable, runInAction } from 'mobx'

import { getApiUrl } from 'src/common'

import {
    Card,
    CardStatus,
    getPresetTitle as getPresetTitleReexport,
    IBpProjectionCard,
    ICard,
    IFindRootQuery,
    PRESET as PRESET_REEXPORT,
    QueryFindBuilder,
} from '../models'
import { AbstractAnalyticsStore } from './Analytics/AbstractAnalyticsStore'

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
        authors: true,
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

const sortFindAnd = ($and: Record<string, unknown>[]): Record<string, unknown>[] => {
    const clone = [...$and]

    return clone.sort((a, b) => {
        const aKey = Object.keys(a).pop()
        const bKey = Object.keys(b).pop()

        if(aKey === undefined) return -1
        if(bKey === undefined) return 1

        return aKey < bKey ? 1 : -1
    })
}

export class CardStore {
    public readonly querryFindBuilder = new QueryFindBuilder()

    @computed public get find(): IFindRootQuery { return this.querryFindBuilder.find }
    @computed public get selectedPreset(): QueryFindBuilder['selectedPreset'] { return this.querryFindBuilder.selectedPreset }

    @computed public get sort(): IBrowserStoreSort { return this._sort }
    public set sort(value: IBrowserStoreSort) {
        this._sort = value
    }

    public static defaultSortOrder: -1 | 1 = -1
    public static sortFindAnd = sortFindAnd

    @observable public autoQuerry = true
    @observable public cards: ObservableMap<ICard<CardStatus.ok>> = new ObservableMap()
    @observable public cardsPerPage = 24
    @observable public count: null | number = null

    @observable protected _sort: IBrowserStoreSort = {'steam.subscriberCount': -1}
    protected disposers: IReactionDisposer[] = []
    private analyticsStore: AbstractAnalyticsStore
    private abortController: AbortController | null = null

    public constructor(analyticsStore: AbstractAnalyticsStore) {
        this.analyticsStore = analyticsStore
        this.disposers.push(autorun(
            () => JSON.stringify(this.find) && this.fetch(),
            {
                name: `${__filename}: autorun(query)`,
                delay: 400,
            }
        ))
    }

    public deconstructor(): void {
        for(const disposer of this.disposers) disposer()
    }

    public async nextPage(): Promise<{count: number, limit: number, skip: number}> {
        const skip = this.cards.size
        const limit = this.cardsPerPage
        const timer = Date.now()

        const res = await fetch(getApiUrl(this.find.$and, {
                $search: this.find.$text?.$search,
                projection: cardProjection,
                sort: this.sort,
                limit,
                skip
            }))
        const {count, docs} = await res.json() as {count: number, docs: IBpProjectionCard[] }

        // TODO: handle non-ok cards
        const cards = docs
            .map<[number, Card<CardStatus.ok>]>((doc) => [doc._id, new Card(doc)])
            .filter(([id, card]) => card.isStatus(CardStatus.praisedOnce))

        runInAction(`${__filename}: .nextPage()`, () => {
            this.count = count
            this.cards.merge(cards)
        })

        this.analyticsStore.trackEvent(
            'loadTime',
            this.selectedPreset,
            this.selectedPreset !== 'custom' ? '<stripped>' : this.querryFindBuilder.findStringified,
            (Date.now() - timer) / 1000,
        )

        return {count, limit, skip}
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
                    getApiUrl(this.find.$and, {
                        $search: this.find.$text?.$search,
                        projection: cardProjection,
                        sort: this.sort,
                        limit: this.cardsPerPage,
                    }),
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

            // this.analyticsStore.trackEvent(
            //     'selected-preset',
            //     this.selectedPreset,
            //     this.selectedPreset !== 'custom' ? undefined : this.findStringified,
            //     this.count,
            // )

            // if(this.selectedPreset === 'custom') {
            //     for(const filter of this.find.$and) {
            //         const [filterName, filterValue] = Object.entries(filter).shift()!
            //         this.analyticsStore.trackEvent(
            //             'customFilter',
            //             filterName,
            //             JSON.stringify(filterValue),
            //         )
            //     }
            // }

            if(typeof this.find.$text?.$search === 'string') {
                this.analyticsStore.trackSiteSearch(
                    this.find.$text?.$search,
                    this.selectedPreset,
                    count,
                )
            }

            this.analyticsStore.trackEvent(
                'loadTime',
                this.selectedPreset,
                this.selectedPreset !== 'custom' ? '<stripped>' : this.querryFindBuilder.findStringified,
                (Date.now() - timer) / 1000,
            )
        } catch(err) {
            if((err as Error).name === 'AbortError') {
                // Don't report aborted fetches as failed.
                console.warn(`Previous fetch was aborted due changes in the query.`)

                return
            }

            console.error(err)

            runInAction(`${__filename}: .querry(catch)`, () => {
                this.count = -1
                this.cards.replace([])
            })
        }
    }
}
