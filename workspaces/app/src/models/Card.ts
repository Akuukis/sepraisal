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
    classes?: {[key in keyof Pick<IBlueprint.IClasses, ProjectionCardClasses>]: IBlueprint.IClasses[key]},
    sbc?: {[key in keyof Pick<IBlueprint.ISbc, ProjectionCardSbc>]: IBlueprint.ISbc[key]}
    steam?: {[key in keyof Pick<IBlueprint.ISteam, ProjectionCardSteam>]: IBlueprint.ISteam[key]}
    thumb?: {[key in keyof Pick<IBlueprint.IThumb, ProjectionCardThumb>]: IBlueprint.IThumb[key]}
}

export interface ICard<T extends CardStatus = CardStatus.discovered> {
    classes: T extends CardStatusClassedOnce ? Required<IBpProjectionCard>['classes'] : null
    id: number
    sbc: T extends CardStatusPraisedOnce ? Required<IBpProjectionCard>['sbc'] : null
    steam: T extends CardStatusScrapedOnce ? Required<IBpProjectionCard>['steam'] : null
    thumb: T extends CardStatusThumbedOnce ? Required<IBpProjectionCard>['thumb'] : null

    isStatus<TStatus extends CardStatus>(status: TStatus): this is ICard<TStatus>
}

export class Card<T extends CardStatus = CardStatus.discovered> implements ICard<T> {
    public readonly status: T

    protected dto: IBpProjectionCard

    public constructor(dto: IBpProjectionCard) {
        this.dto = dto
        this.status = this.getStatus() as T
        if(dto.steam) {
            dto.steam._updated = new Date(dto.steam._updated)
            dto.steam.postedDate = new Date(dto.steam.postedDate)
            dto.steam.updatedDate = new Date(dto.steam.updatedDate)
        }
    }

    public isStatus<TStatus extends CardStatus>(status: TStatus): this is Card<TStatus> {
        return this.status >= status
    }

    public get id() { return this.dto._id }

    // tslint:disable: max-line-length no-non-null-assertion
    public get steam(): ICard<T>['steam']     { return (this.isStatus(CardStatus.scrapedOnce) ? this.dto.steam!   : null) as ICard<T>['steam'] }
    public get thumb(): ICard<T>['thumb']     { return (this.isStatus(CardStatus.thumbedOnce) ? this.dto.thumb!   : null) as ICard<T>['thumb'] }
    public get sbc(): ICard<T>['sbc']         { return (this.isStatus(CardStatus.praisedOnce) ? this.dto.sbc!     : null) as ICard<T>['sbc'] }
    public get classes(): ICard<T>['classes'] { return (this.isStatus(CardStatus.classedOnce) ? this.dto.classes! : null) as ICard<T>['classes'] }
    // tslint:enable: max-line-length no-non-null-assertion

    public toJSON(): IBpProjectionCard {
        return this.dto
    }

    // tslint:disable-next-line: mccabe-complexity cognitive-complexity
    private getStatus(): CardStatus {
        const dto = this.dto

        const {steam} = dto
        if(!steam) return CardStatus.discovered
        if('_error' in steam) return CardStatus.discovered
        if(steam._version < IBlueprint.VERSION.steam) return CardStatus.discovered

        const {thumb} = dto
        if(!thumb) return CardStatus.scrapedOnce
        if('_error' in thumb) return CardStatus.scrapedOnce
        if(thumb._version < IBlueprint.VERSION.thumb) return CardStatus.scrapedOnce

        const {sbc} = dto
        if(!sbc) return CardStatus.thumbedOnce
        if('_error' in sbc) return CardStatus.thumbedOnce
        if(sbc._version < IBlueprint.VERSION.sbc) return CardStatus.thumbedOnce

        const {classes} = dto
        if(!classes) return CardStatus.praisedOnce
        if('_error' in classes) return CardStatus.praisedOnce
        if(classes._version < IBlueprint.VERSION.classes) return CardStatus.praisedOnce

        if(moment(steam._updated).isBefore(moment().subtract(7, 'd'))) return CardStatus.classedOnce
        if(thumb._revision !== steam._thumbName) return CardStatus.scrapedFresh
        if(sbc._revision < steam.revision) return CardStatus.scrapedFresh
        if(classes._revision < steam.revision) return CardStatus.praisedFresh

        return CardStatus.ok
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
