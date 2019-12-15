import { IBlueprint, ObservableMap } from '@sepraisal/common'
import { action, computed, IReactionDisposer, observable, reaction, runInAction } from 'mobx'

import { API_URL } from '../common'
import { Card, CardStatus, IBpProjectionCard, ICard } from '../models'


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

interface IFind {
    $and: Array<{}>,
    $text?: {$search: string},
}

interface IBrowserStoreSort {
    [field: string]: -1 | 1
}

// tslint:disable-next-line: min-class-cohesion
export class CardStore {

    @computed public get find(): IFind { return this._find }
    @computed public get sort() { return this._sort }
    public set sort(value: IBrowserStoreSort) {
        this._sort = value
    }

    public static defaultSortOrder: -1 | 1 = -1

    public static sortFindAnd($and: object[]) {
        return [...$and].sort((a, b) => {
            const aKey = Object.keys(a).pop()
            const bKey = Object.keys(b).pop()

            if(aKey === undefined) return -1
            if(bKey === undefined) return 1

            return aKey < bKey ? 1 : -1
        })
    }

    @observable public autoQuerry = true
    @observable public cards: ObservableMap<ICard<CardStatus.ok>> = new ObservableMap()
    @observable public cardsPerPage = 12
    @observable public count: null | number = null

    @observable private _find: IFind = PRESET.fighter
    @observable private _sort: IBrowserStoreSort = {subscriberCount: -1}
    private disposers: IReactionDisposer[] = []

    public constructor() {
        this.disposers.push(reaction(() => this.find, async (find) => {
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
            const find = encodeURIComponent(JSON.stringify(this.find))
            const sort = encodeURIComponent(JSON.stringify(this.sort))
            const res = await fetch(`${API_URL}?find=${find}&sort=${sort}&projection=${projection}&skip=${skip}&limit=${limit}`)
            const {count, docs} = await res.json() as {count: number, docs: IBpProjectionCard[] }

            // TODO: handle non-ok cards
            const cards = docs
                .map<[number, Card<CardStatus.ok>]>((doc) => [doc._id, new Card(doc)])
                .filter(([id, card]) => card.isStatus(CardStatus.praisedOnce))

            runInAction(() => this.cards.merge(cards))

            return {count, limit, skip}
        } catch(err) {
            console.error(err)

            return {count: 0, limit, skip}
        }
    }

    @action public async querry() {
        try {
            runInAction(() => {
                this.count = null
                this.cards.replace([])
            })
            const find = encodeURIComponent(JSON.stringify(this.find))
            const sort = encodeURIComponent(JSON.stringify(this.sort))
            const skip = 0
            const res = await fetch(`${API_URL}?find=${find}&sort=${sort}&projection=${projection}&skip=${skip}&limit=${this.cardsPerPage}`)
            const {count, docs} = await res.json() as {count: number, docs: IBpProjectionCard[]}

            // TODO: handle non-ok cards
            const cards = docs
                .map<[number, Card<CardStatus.ok>]>((doc) => [doc._id, new Card(doc)])
                .filter(([id, card]) => card.isStatus(CardStatus.praisedOnce))

            runInAction(() => {
                this.count = count
                this.cards.replace(cards)
            })
        } catch(err) {
            console.error(err)

            runInAction(() => this.cards.replace([]))
        }
    }

    @action public setFind(value: Partial<IFind>) {
        if('$and' in value && value.$and !== undefined) {
            this._find = {
                ...this._find,
                $and: CardStore.sortFindAnd(value.$and),
            }
        }
        if('$text' in value && value.$text && value.$text.$search === '') this._find = {$and: [...this._find.$and]}
        if('$text' in value && value.$text && value.$text.$search !== '') this._find.$text = value.$text
    }
}
