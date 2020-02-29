import { IBlueprint, ObservableMap, getApiUrl } from '@sepraisal/common'
import { action, computed, IReactionDisposer, observable, reaction, runInAction } from 'mobx'

import { Card, CardStatus, IBpProjectionCard, ICard } from '../models'
import { PiwikStore } from './PiwikStore'
import { IFind } from '@sepraisal/common/lib/classificator/Class'


// tslint:disable-next-line: naming-convention
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

const presetUpToDate = [
    {sbc: {$exists: true}},
    {'sbc._version': {$eq: IBlueprint.VERSION.sbc}},
]

const presetShip = [
    ...presetUpToDate,
    {'sbc.vanilla': true},
    {'sbc.blocks.Gyro/SmallBlockGyro': {$exists: true}},
    {$or: [
        {'sbc.blocks.BatteryBlock/SmallBlockBatteryBlock': {$exists: true}},
        {'sbc.blocks.Reactor/SmallBlockSmallGenerator': {$exists: true}},
        {'sbc.blocks.Reactor/SmallBlockLargeGenerator': {$exists: true}},
    ]},
    {$or: [
        {'sbc.blocks.Cockpit/SmallBlockCockpit': {$exists: true}},
        {'sbc.blocks.Cockpit/DBSmallBlockFighterCockpit': {$exists: true}},
    ]},
]

const presetFighter = [
    ...presetShip,
    {'sbc.gridSize': 'Small'},
    {$or: [
        {'sbc.blocks.SmallGatlingGun/': {$exists: true}},
        {'sbc.blocks.SmallMissileLauncher/': {$exists: true}},
    ]},
]

const genFighterPreset = (...args) =>
    ({$and: [
        ...presetFighter,
        {'sbc.blockCount': {$gte: args[0], $lte: args[1] } },
        {'sbc.blockMass' : {$gte: args[2], $lte: args[3] } },
        {'sbc.blockPCU'  : {$gte: args[4], $lte: args[5] } },
        {'sbc.oreVolume' : {$gte: args[6], $lte: args[7] } },
        // {'sbc.gridCount' : {$gte: args[8], $lte: args[9] } },
    ]})


// tslint:disable: object-literal-sort-keys
export const PRESET = {
    // fighter50:    genFighterPreset(153, 572 , 13151, 42185 , 1651, 4043 , 10253, 31773 , 1, 1),
    fighter/* 80 */: genFighterPreset(103, 1197, 9053 , 80361 , 1205, 6546 , 7102 , 59263 , 0, 2),
    // fighter95:    genFighterPreset(72 , 3059, 6430 , 180955, 891 , 11889, 5065 , 129737, 0, 3),
    ship: {$and: [...presetShip]},
    none: {$and: [...presetUpToDate]},
}
// tslint:enable: object-literal-sort-keys

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

const PRESET_STRINGIFIED: Record<keyof typeof PRESET, string> = {
    fighter: JSON.stringify(sortFindAnd(PRESET.fighter.$and)),
    none: JSON.stringify(sortFindAnd(PRESET.none.$and)),
    ship: JSON.stringify(sortFindAnd(PRESET.ship.$and)),
}

// tslint:disable-next-line: min-class-cohesion
export class CardStore {

    @computed public get find(): IFind { return this._find }

    @computed private get findStringified() {
        return JSON.stringify(sortFindAnd(this.find.$and))
    }

    @computed public get selectedPreset() {
        const foundPreset = (Object.keys(PRESET) as Array<keyof typeof PRESET>)
            .find((key) => this.findStringified === PRESET_STRINGIFIED[key])

        return foundPreset ?? 'custom'
    }
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

    @observable protected _find: IFind = PRESET.fighter
    @observable protected _sort: IBrowserStoreSort = {subscriberCount: -1}
    protected disposers: IReactionDisposer[] = []
    private piwikStore: PiwikStore

    public constructor(piwikStore: PiwikStore) {
        this.piwikStore = piwikStore
        this.disposers.push(reaction(() => this.find.$and, async (find) => {
            await this.querry()
        }))
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

            runInAction(() => this.cards.merge(cards))

            this.piwikStore.push([
                'trackEvent',
                'load-time',
                this.selectedPreset,
                this.selectedPreset !== 'custom' ? undefined : this.findStringified,
                (Date.now() - timer) / 1000,
            ])

            return {count, limit, skip}
        } catch(err) {
            console.error(err)

            return {count: 0, limit, skip}
        }
    }

    @action public async querry() {
        try {
            const timer = Date.now()

            runInAction(() => {
                this.count = null
                this.cards.replace([])
            })

            const res = await fetch(getApiUrl(this.find, cardProjection, this.sort, this.cardsPerPage))
            if(res.status !== 200) throw new Error(`Backend error: ${await res.text()}`)
            const {count, docs} = await res.json() as {count: number, docs: IBpProjectionCard[]}

            // TODO: handle non-ok cards
            const cards = docs
                .map<[number, Card<CardStatus.ok>]>((doc) => [doc._id, new Card(doc)])
                .filter(([id, card]) => card.isStatus(CardStatus.praisedOnce))

            runInAction(() => {
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
                this.selectedPreset !== 'custom' ? undefined : this.findStringified,
                (Date.now() - timer) / 1000,
            ])
        } catch(err) {
            console.error(err)

            runInAction(() => {
                this.count = -1
                this.cards.replace([])
            })
        }
    }

    @action public setFind(diff: Partial<IFind>) {

        // If changed, automatically trigger query via mobx due reaction above on `this.find.$and`.
        if('$and' in diff && diff.$and) {
            this._find.$and = sortFindAnd(diff.$and)
        }

        // Doesn't automatically trigger query because there's no reaction on `this.find.$text`.
        if('$text' in diff) this._find.$text = '$text' in diff ? diff.$text : this._find.$text
    }
}
