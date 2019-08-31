import { IBlueprint } from '@sepraisal/common'
import * as moment from 'moment'


export type ProjectionCardSteam =
    | '_error'
    | '_thumbName'
    | '_updated'
    | '_version'
    | 'author'
    | 'collections'
    | 'flagsGreen'
    | 'flagsRed'
    | 'flagsYellow'
    | 'id'
    | 'postedDate'
    | 'ratingCount'
    | 'ratingStars'
    | 'revision'
    | 'subscriberCount'
    | 'title'
    | 'updatedDate'

export type ProjectionCardThumb =
    | '_error'
    | '_version'
    | '_revision'
    | 'webp'

export type ProjectionCardSbc =
    | '_error'
    | '_version'
    | '_revision'
    | 'blockCount'
    | 'blockPCU'
    | 'oreVolume'
    | 'gridSize'
    | 'blockTime'
    | 'componentTime'
    | 'ingotTime'
    | 'flagsRed'
    | 'flagsYellow'
    | 'flagsGreen'

export type ProjectionCardClasses =
    | '_error'
    | '_version'
    | '_revision'

export interface IBpProjectionCard {
    _id: number,                      // discover.ts
    classes: {[key in keyof Pick<IBlueprint.IClasses, ProjectionCardClasses>]: IBlueprint.IClasses[key]},
    sbc: {[key in keyof Pick<IBlueprint.ISbc, ProjectionCardSbc>]: IBlueprint.ISbc[key]}
    steam: {[key in keyof Pick<IBlueprint.ISteam, ProjectionCardSteam>]: IBlueprint.ISteam[key]}
    thumb: {[key in keyof Pick<IBlueprint.IThumb, ProjectionCardThumb>]: IBlueprint.IThumb[key]}
}

export interface ICard<T extends CardStatus = CardStatus.discovered> {
    classes: T extends CardStatusClassedOnce ? IBpProjectionCard['classes'] : never
    dto:
        T extends CardStatusOk          ? Pick<IBpProjectionCard, '_id' | 'steam' | 'thumb' | 'sbc' | 'classes'> :  // tslint:disable-line: max-union-size
        T extends CardStatusClassedOnce ? Pick<IBpProjectionCard, '_id' | 'steam' | 'thumb' | 'sbc' | 'classes'> :  // tslint:disable-line: max-union-size
        T extends CardStatusPraisedOnce ? Pick<IBpProjectionCard, '_id' | 'steam' | 'thumb' | 'sbc'> :              // tslint:disable-line: max-union-size
        T extends CardStatusThumbedOnce ? Pick<IBpProjectionCard, '_id' | 'steam' | 'thumb'> :
        T extends CardStatusScrapedOnce ? Pick<IBpProjectionCard, '_id' | 'steam'> :
        T extends CardStatusNothing     ? Pick<IBpProjectionCard, '_id'> :
        never

    id: number
    sbc: T extends CardStatusPraisedOnce ? IBpProjectionCard['sbc'] : never
    steam: T extends CardStatusScrapedOnce ? IBpProjectionCard['steam'] : never
    thumb: T extends CardStatusThumbedOnce ? IBpProjectionCard['thumb'] : never

    isStatus<TStatus extends CardStatus>(status: TStatus): this is ICard<TStatus>
}

export class Card<T extends CardStatus = CardStatus.discovered> implements ICard<T> {
    public dto: ICard<T>['dto']

    public constructor(dto: IBpProjectionCard) {
        this.dto = dto as ICard<T>['dto']
        if(this.status > CardStatus.scrapedOnce) {
            dto.steam._updated = new Date(dto.steam._updated)
            dto.steam.postedDate = new Date(dto.steam.postedDate)
            dto.steam.updatedDate = new Date(dto.steam.updatedDate)
        }
    }

    // tslint:disable-next-line: mccabe-complexity cognitive-complexity
    public get status(): CardStatus {
        const self = this as unknown as ICard<CardStatus.ok>  // Hacky way to simplify boilerplate - I check for status here anyway.
        if(!('steam' in self.dto)) return CardStatus.discovered
        if('_error' in self.dto.steam) return CardStatus.discovered
        if(self.dto.steam._version < IBlueprint.VERSION.steam) return CardStatus.discovered

        if(!('thumb' in self.dto)) return CardStatus.scrapedOnce
        if('_error' in self.dto.thumb) return CardStatus.scrapedOnce
        if(self.dto.thumb._version < IBlueprint.VERSION.thumb) return CardStatus.scrapedOnce

        if(!('sbc' in self.dto)) return CardStatus.thumbedOnce
        if('_error' in self.dto.sbc) return CardStatus.thumbedOnce
        if(self.dto.sbc._version < IBlueprint.VERSION.sbc) return CardStatus.thumbedOnce

        if(!('classes' in self.dto)) return CardStatus.praisedOnce
        if('_error' in self.dto.classes) return CardStatus.praisedOnce
        if(self.dto.classes._version < IBlueprint.VERSION.classes) return CardStatus.praisedOnce

        if(moment(self.dto.steam._updated).isBefore(moment().subtract(7, 'd'))) return CardStatus.classedOnce
        if(self.dto.thumb._revision !== self.dto.steam._thumbName) return CardStatus.scrapedFresh
        if(self.dto.sbc._revision < self.dto.steam.revision) return CardStatus.scrapedFresh
        if(self.dto.classes._revision < self.dto.steam.revision) return CardStatus.praisedFresh


        return CardStatus.ok
    }

    public isStatus<TStatus extends CardStatus>(status: TStatus): this is Card<TStatus> {
        return this.status >= status
    }

    public get id() { return this.dto._id }

    public get steam()   { return (this.isStatus(CardStatus.scrapedOnce) ? this.dto.steam   : null) as ICard<T>['steam'] }
    public get thumb()   { return (this.isStatus(CardStatus.thumbedOnce) ? this.dto.thumb   : null) as ICard<T>['thumb'] }
    public get sbc()     { return (this.isStatus(CardStatus.praisedOnce) ? this.dto.sbc     : null) as ICard<T>['sbc'] }
    public get classes() { return (this.isStatus(CardStatus.classedOnce) ? this.dto.classes : null) as ICard<T>['classes'] }

    // public get gridSize() { return this.dto.sbc.gridSize === 'Large' ? 'L' : 'S' }
    // public get time() { return Math.floor((this.dto.sbc.blockTime + this.dto.sbc.componentTime + this.dto.sbc.ingotTime) / 60) }
    // public get flagsGreen() { return ([] as string[]).concat(this.dto.steam.flagsGreen).concat(this.dto.sbc.flagsGreen) }
    // public get flagsYellow() { return ([] as string[]).concat(this.dto.steam.flagsYellow).concat(this.dto.sbc.flagsYellow) }
    // public get flagsRed() { return ([] as string[]).concat(this.dto.steam.flagsRed).concat(this.dto.sbc.flagsRed) }

    public toJSON(): this['dto'] {
        return this.dto
    }

}

export enum CardStatus {
    'discovered',
    'scrapedOnce',
    'thumbedOnce',
    'praisedOnce',
    'classedOnce',
    'scrapedFresh',
    'thumbedFresh',
    'praisedFresh',
    'ok',
}

type CardStatusOk =
    | CardStatus.ok
    | CardStatus.praisedFresh
    | CardStatus.thumbedFresh
    | CardStatus.scrapedFresh
type CardStatusClassedOnce = CardStatus.classedOnce | CardStatusOk
type CardStatusPraisedOnce = CardStatus.praisedOnce | CardStatusClassedOnce
type CardStatusThumbedOnce = CardStatus.thumbedOnce | CardStatusPraisedOnce
type CardStatusScrapedOnce = CardStatus.scrapedOnce | CardStatusThumbedOnce
type CardStatusNothing = CardStatus.discovered | CardStatusScrapedOnce
