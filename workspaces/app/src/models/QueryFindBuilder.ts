import { IBlueprint, ObservableMap, RequiredSome } from '@sepraisal/common'
import { action, computed, IReactionDisposer, observable } from 'mobx'
import { QuerySelector, RootQuerySelector } from 'mongodb'

import { BLOCK_GROUPS } from 'src/common'

import { CardStatus, ICard } from '../models'


export type FindCriterionDirect = QuerySelector<string | number | boolean>
export type FindQueryDirect = {
    [P in keyof IBlueprint]?: FindCriterionDirect
} & {
    [key: string]: FindCriterionDirect
}

export type FindCriterionGroup = FindQueryDirect[]
export type FindQueryGroup = {
    $or: FindCriterionGroup
}

export type FindCriterion = FindCriterionDirect | FindCriterionGroup
export type FindQuery = FindQueryDirect | FindQueryGroup

export type FindQueryPreset = FindQuery[]
export interface IFindRootQuery extends RequiredSome<Pick<RootQuerySelector<IBlueprint>, '$and' | '$text'>, '$and'> {
    $and: FindQueryPreset,
    // $text?: {$search: string},
}

const blockGroupToQuery = (fullIds: string[], $exists = true) => {
    return {
        $or: fullIds.map((fullId) => ({
            [`sbc.blocks.${fullId}`]: {$exists}
        }))
    }
}

const presetUpToDate: FindQueryPreset = [
    {sbc: {$exists: true}},
    {'sbc._version': {$eq: IBlueprint.VERSION.sbc}},
]

const presetStation: FindQueryPreset = [
    ...presetUpToDate,
    {'sbc.blockStatic': {$eq: true}},
    blockGroupToQuery(BLOCK_GROUPS.POWER),
]

const presetShip: FindQueryPreset = [
    ...presetUpToDate,
    {'sbc.vanilla': {$eq: true}},
    blockGroupToQuery(BLOCK_GROUPS.GYRO),
    blockGroupToQuery(BLOCK_GROUPS.POWER),
    blockGroupToQuery(BLOCK_GROUPS.THRUSTER),
    blockGroupToQuery(BLOCK_GROUPS.COCKPIT),
]

const presetRover: FindQueryPreset = [
    ...presetUpToDate,
    blockGroupToQuery(BLOCK_GROUPS.GYRO),
    blockGroupToQuery(BLOCK_GROUPS.POWER),
    blockGroupToQuery(BLOCK_GROUPS.COCKPIT),
    blockGroupToQuery(BLOCK_GROUPS.WHEELS),
]

const presetMiner: FindQueryPreset = [
    ...presetUpToDate,
    blockGroupToQuery(BLOCK_GROUPS.GYRO),
    blockGroupToQuery(BLOCK_GROUPS.POWER),
    blockGroupToQuery(BLOCK_GROUPS.COCKPIT),
    blockGroupToQuery(BLOCK_GROUPS.TOOL_DRILL),
]

const presetFighter: FindQueryPreset = [
    ...presetUpToDate,
    {'sbc.vanilla': {$eq: true}},
    {'sbc.gridSize': {$eq: 'Small'}},
    blockGroupToQuery(BLOCK_GROUPS.GYRO),
    blockGroupToQuery(BLOCK_GROUPS.POWER),
    blockGroupToQuery(BLOCK_GROUPS.THRUSTER),
    blockGroupToQuery(BLOCK_GROUPS.COCKPIT_CLOSED),
    blockGroupToQuery(BLOCK_GROUPS.WEAPON_FIXED),
]

const genFighterPreset = (...args): FindQuery[] => [
        ...presetFighter,
        {'sbc.blockCount': {$gte: args[0], $lte: args[1] } },
        {'sbc.blockMass' : {$gte: args[2], $lte: args[3] } },
        {'sbc.blockPCU'  : {$gte: args[4], $lte: args[5] } },
        {'sbc.oreVolume' : {$gte: args[6], $lte: args[7] } },
        // {'sbc.gridCount' : {$gte: args[8], $lte: args[9] } },
    ]


export const PRESET = {
    // fighter50:    genFighterPreset(153, 572 , 13151, 42185 , 1651, 4043 , 10253, 31773 , 1, 1),
    fighter/* 80 */: genFighterPreset(103, 1197, 9053 , 80361 , 1205, 6546 , 7102 , 59263 , 0, 2),
    // fighter95:    genFighterPreset(72 , 3059, 6430 , 180955, 891 , 11889, 5065 , 129737, 0, 3),
    miner: [...presetMiner] as FindQuery[],
    ship: [...presetShip] as FindQuery[],
    rover: [...presetRover] as FindQuery[],
    station: [...presetStation] as FindQuery[],
    none: [...presetUpToDate] as FindQuery[],
}

export const getPresetTitle = (id: keyof typeof PRESET | 'custom'): string => {
    switch(id) {
        case 'fighter': return 'Fighter (vanilla)'
        case 'miner': return 'Miner'
        case 'none': return 'None'
        case 'rover': return 'Rover'
        case 'ship': return 'Ship'
        case 'station': return 'Station'
        default: return ''
    }
}

interface IBrowserStoreSort {
    [field: string]: -1 | 1
}

const sortFindAnd = ($and: FindQueryPreset): FindQueryPreset => {
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
    fighter: JSON.stringify(sortFindAnd(PRESET.fighter)),
    miner: JSON.stringify(sortFindAnd(PRESET.miner)),
    none: JSON.stringify(sortFindAnd(PRESET.none)),
    rover: JSON.stringify(sortFindAnd(PRESET.rover)),
    ship: JSON.stringify(sortFindAnd(PRESET.ship)),
    station: JSON.stringify(sortFindAnd(PRESET.station)),
}

/**
* Create and edit a valid MongoDB find() querry using Filter controls.
*
* Goals:
* - Editable by form controls
* - Editable directly by User with minimally limited MongoDB syntax freedom.
* - both changes are synced
*
* Restrictions:
* - Valid MongoDB syntax as source of truth (so User can read it docs and do magic)
* - top-level `$and` operator (it's just convenient for form controls)
*
* Form controls (a React component) adds, edits and removes criteria (a object within `$and` array).
* One Form control may manage one criterion (e.g. "sbc.vanilla") or many criteria (e.g. "sbc.blocks.*").
*
* Those criteria must have IDs so that Form control can find it within the `$and` array. There are two ways:
* - when criterion has one-to-one relationship with a field, that field can be used as ID (e.g. "sbc.vanilla").
* - when criterion has one-to-many relationship with multiple known fields as part of `$or` group,
*   the list fields are sort alphabetically and concatenated using `,` seperator into a ID.
* - NOT USED/SUPPORTED: when criterion has one-to-many relationship with changing amount of fields.
*/
export class QueryFindBuilder {
    static serializeId = (idOrIds: string | string[]): string => {
        if(!Array.isArray(idOrIds)) return idOrIds

        return idOrIds
            .sort((a, b) => a > b ? 1 : -1)  // alphabetically.
            .join(',')
    }
    static parseId = (idSerial: string): string | string[] => {
        if(!idSerial.includes(',')) return idSerial

        return idSerial.split(',')
    }

    public static isCriterionGroup = (criterion: FindCriterion): criterion is FindCriterionGroup => {
        return Array.isArray(criterion)
    }
    public static isCriterionDirect = (criterion: FindCriterion): criterion is FindCriterionDirect => {
        return !QueryFindBuilder.isCriterionGroup(criterion)
    }

    @computed public get find(): IFindRootQuery { return this._find }

    @computed public get findStringified(): string {
        const queriesSorted = sortFindAnd(this.find.$and)
        return JSON.stringify(queriesSorted)
    }

    @computed public get findStringifiedOnlyQueries(): string {
        const queriesSorted = sortFindAnd(this.find.$and)
        const queriesFiltered = queriesSorted
            .filter((query) => Object.keys(query).pop() !== 'steam.authors.title')
            .filter((query) => Object.keys(query).pop() !== 'steam.collections.title')
        return JSON.stringify(queriesFiltered)
    }

    @computed public get selectedPreset(): keyof typeof PRESET | 'custom' {
        const foundPreset = (Object.keys(PRESET) as Array<keyof typeof PRESET>)
            .find((key) => this.findStringifiedOnlyQueries === PRESET_STRINGIFIED[key])

        return foundPreset ?? 'custom'
    }
    @computed public get sort(): IBrowserStoreSort { return this._sort }
    public set sort(value: IBrowserStoreSort) {
        this._sort = value
    }

    public static defaultSortOrder: -1 | 1 = -1
    public static sortFindAnd = sortFindAnd

    @observable public autoQuerry = true
    @observable public cards: ObservableMap<ICard<CardStatus.ok>> = new ObservableMap()
    @observable public cardsPerPage = 12
    @observable public count: null | number = null

    @observable protected _find: IFindRootQuery = {$and: PRESET.none}
    @observable protected _sort: IBrowserStoreSort = {subscriberCount: -1}
    protected disposers: IReactionDisposer[] = []

    // public constructor() {
    // }

    public deconstructor(): void {
        for(const disposer of this.disposers) disposer()
    }

    @computed private get byIds(): Array<[string, FindCriterionDirect | FindCriterionGroup]> {
        return this._find.$and
            .map((criterionWrapper, i) => {
                const key = Object.keys(criterionWrapper).pop()
                if(!key) {
                    const $comment = `Found criteria wrapper without content at position ${i}, ignoring..`
                    console.warn($comment)
                    return ['__warnings', {$comment}] as [string, Record<string, unknown>]
                }

                const criterion = criterionWrapper[key] as FindCriterionDirect
                if(key !== '$or') return [key, criterion] as [string, FindCriterionDirect]

                const innerKeys = (criterion as FindCriterionGroup)
                    .map((subCriterion) => Object.keys(subCriterion).pop())
                    .filter((key): key is string => typeof key === 'string')  // Redundant but to be safe.

                return [QueryFindBuilder.serializeId(innerKeys), criterion] as [string, FindCriterionGroup]
            })
            .filter((amIundefined) => amIundefined !== undefined)
    }

    public getCriterion<T extends FindCriterionDirect = FindCriterionDirect>(idOrIds: string): T | null
    public getCriterion<T extends FindCriterionGroup = FindCriterionGroup>(idOrIds: string[]): T | null
    public getCriterion<T extends FindCriterion = FindCriterion>(idOrIds: string | string[]): T | null
    public getCriterion<T extends FindCriterion = FindCriterion>(idOrIds: string | string[]): T | null {
        const id = QueryFindBuilder.serializeId(idOrIds)
        return (this.byIds.find(([innerId]) => innerId === id)?.[1] as T | undefined) ?? null  // Brackets for Babel.
    }

    public setCriterion(idOrIds: string, criterion: FindCriterionDirect | null): void
    public setCriterion(idOrIds: string[], criterion: FindCriterion | null): void
    public setCriterion(idOrIds: string | string[], criterion: FindCriterionDirect | null): void
    @action public setCriterion(idOrIds: string | string[], criterion: FindCriterion| null): void {
        const id = QueryFindBuilder.serializeId(idOrIds)

        const index = this.byIds.findIndex(([innerId]) => innerId === id)

        if(criterion === null) {
            if(index === -1) return

            this._find.$and = [
                ...this._find.$and.slice(0, Math.max(0, index)),
                ...this._find.$and.slice(index + 1, this._find.$and.length),
            ]
            return
        }

        let query: FindQuery
        if(Array.isArray(idOrIds)) {
            query = fromCriterionGroup(idOrIds, criterion)
        } else if(!Array.isArray(idOrIds) && QueryFindBuilder.isCriterionDirect(criterion)) {
            query = fromCriterionDirect(idOrIds, criterion)
        } else {
            throw new Error('catch me')
        }

        if(index === -1) {
            this._find.$and.push(query)
        } else {
            this._find.$and = [
                ...this._find.$and.slice(0, Math.max(0, index)),
                query,
                ...this._find.$and.slice(index + 1, this._find.$and.length),
            ]
        }
    }

    @action public replaceQueries(queries: FindQuery[]): void {
        // Leave author's & collections unchanged, because they are manipulated in search bar, not filter sidepanel.
        const authors = this.getCriterion('steam.authors.title')
        const collections = this.getCriterion('steam.collections.title')
        this.replaceFilter({$and: queries})
        this.setCriterion('steam.authors.title', authors)
        this.setCriterion('steam.collections.title', collections)
    }

    @action public replaceSearch($search?: string): void {
        this.replaceFilter({$text: $search === undefined ? undefined : {$search}})
    }

    @action public replaceFilter(diff: Partial<IFindRootQuery>): void {
        // If changed, automatically trigger query via mobx due reaction above on `this.find.$and`.
        if('$and' in diff && diff.$and) {
            this._find.$and = sortFindAnd(diff.$and)
        }

        // Doesn't automatically trigger query because there's no reaction on `this.find.$text`.
        // if `$text` property is `undefined`, it will be deleted later as part of JSON serialize and parse.
        if('$text' in diff) this._find.$text = diff.$text
    }
}

const fromCriterionDirect = (id: string, criterion: FindCriterionDirect): FindQueryDirect => {
    return {[id]: criterion}
}

const fromCriterionGroup = (ids: string[], criterion: FindCriterionDirect | FindCriterionGroup): FindQueryGroup => {
    if(QueryFindBuilder.isCriterionGroup(criterion)) {
        return {$or: criterion}
    } else {
        return {$or: ids.map((id) => ({[id]: criterion}))}
    }
}
