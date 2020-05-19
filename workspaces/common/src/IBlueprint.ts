
// tslint:disable:member-ordering id-length

export enum GridSize {
    Small = 'Small',
    Large = 'Large',
    MIXED = 'Mixed',
}

export enum Direction {
    Backward = 'Backward',
    Down = 'Down',
    Forward = 'Forward',
    Left = 'Left',
    Right = 'Right',
    Up = 'Up',
}

export interface IOrientation {
    readonly Forward: Direction,
    readonly Up: Direction,
}


interface IMongoDbDoc {
    _id: number,
}

export interface IBlueprint extends IMongoDbDoc {
    // _id: number,                      // discover.ts
    steam?: IBlueprint.ISteam,             // scrape.ts
    thumb?: IBlueprint.IThumb,             // thumb.ts
    sbc?: IBlueprint.ISbc,                 // praise.ts
    classes?: IBlueprint.IClasses          // TODO
}


export namespace IBlueprint {

    // tslint:disable-next-line: no-object-literal-type-assertion
    export const VERSION = {
        classes: 1,
        sbc: 6,
        steam: 1,
        thumb: 2,
    } as const

    interface IProp {
        /**
         * Info may be outdated because of newer data model (relative to hardcoded values in code).
         */
        _version: number,
        /**
         * Blueprint may have changed (relative to `steamData._thumbName` or `steamData.revision`).
         */
        _revision: number | string | null,
        /**
         * Info may be non-abtainable due error that implies it's pointless to try again.
         */
        _error?: number,  // Version at which it happened. Try again with newer versions.
        _errorDetails?: string,  // Human-readable details. Helps to debug.
    }

    export interface IRefItem {
        id: number | string,
        title: string,
    }

    type Flags<T extends string> = T[]

    export enum SteamFlagsRed {
        Broken = 'broken',
        Outdated = 'outdated',
        Obselete = 'obselete',
        OverTemMb = 'overTenMB',
        PreSurvival = 'preSurvival',
        Private = 'private',
        Wip = 'wip',
    }
    export enum SteamFlagsYellow {
        Decommisioned = 'decommisioned',
        NoImage = 'noImage',
        OverQuarterMb = 'overQuarterMB',
        PreOverhaul01Physics = 'PreOverhaul01Physics',  // 2017-11-17
        PreOverhaul02Wheels = 'PreOverhaul02Wheels',  // 2018-02-02
        PreOverhaul03Mp = 'PreOverhaul03Mp',  // 2018-07-19
        Unrevised = 'unrevised',
    }
    export enum SteamFlagsGreen {
        BelowOneMb = 'belowOneMB',
        Description = 'description',
        FiveStars = 'fiveStars',
        // PostOverhaul04Survival = 'postOverhaul04Survival',  // 2019-02-28
        PostOverhaul05LCDs = 'PostOverhaul05LCDs',  // 2019-04-08
        RevisedInMonth = 'revisedInMonth',
        RevisedInYear = 'revisedInYear',
    }

    export interface ISteam extends IProp {
        id: number,
        title: string,
        author: IRefItem,
        description: string,
        _thumbName: string | null,
        _updated: Date,  // Info may be outdated because time has passed.
        _revision: null,

        postedDate: Date,
        updatedDate: Date,
        sizeMB: number,
        revision: number,
        mods: IRefItem[],
        collections: IRefItem[],

        ratingStars: number | null,
        ratingCount: number | null,
        commentCount: number,
        visitorCount: number,
        subscriberCount: number,
        favoriteCount: number,

        activityMax: number,
        activityTotal: number,
        exposureMax: number,
        exposureTotal: number,

        flagsRed: Flags<SteamFlagsRed>,
        flagsYellow: Flags<SteamFlagsYellow>,
        flagsGreen: Flags<SteamFlagsGreen>,


        // Calculated during aggregation:
        popularity: number,
    }

    export interface IThumb extends IProp {
        _revision: string | null,
        webp: Buffer | null,
    }

    export interface IMaterialGroup {
        blockCount: number,
        blockMass: number,
        blockPCU: number,
        oreVolume: number,
    }

    export interface IMaterialGroupFull extends IMaterialGroup {
        blockVolume: number,
        blockTime: number,
        blockIntegrity: number,
        componentCount: number,
        componentMass: number,
        componentVolume: number,
        componentTime: number,
        ingotCount: number,
        ingotMass: number,
        ingotVolume: number,
        ingotTime: number,
        oreCount: number,
        oreMass: number,
    }

    export type SbcFlagsRed =
        |''
    export type SbcFlagsYellow =
        |''
    export type SbcFlagsGreen =
        |''

    export interface IDefinitions {
        blocks: Record<string, number>,  // key = CubeType + '/' + subtype
        components: Record<string, number>,  // key = subtype
        ingots: Record<string, number>,  // key = subtype
        ores: Record<string, number>,  // key = subtype
    }

    export interface ISbc extends IProp, IDefinitions, IMaterialGroupFull {
        _revision: number,
        vanilla: boolean,
        gridTitle: string,
        gridSize: GridSize,
        gridCount: number,
        gridStatic: boolean,

        missingDefinitions: IDefinitions

        orientation: IOrientation,
        length: number,
        width: number,
        height: number,

        thrustAtmospheric: Partial<Record<Direction, number>>
        thrustHydrogen: Partial<Record<Direction, number>>
        thrustIon: Partial<Record<Direction, number>>
        integrityPlanes: {
            front: number[][];
            side: number[][];
            top: number[][];
            rotated: boolean;
            maxValue: number;
        },

        flagsRed: Flags<SbcFlagsRed>,
        flagsYellow: Flags<SbcFlagsYellow>,
        flagsGreen: Flags<SbcFlagsGreen>,

        groupPower: IMaterialGroup,
        groupLifeSupport: IMaterialGroup,
        groupStructure: IMaterialGroup,
        groupMobility: IMaterialGroup,
        groupProduction: IMaterialGroup,
        groupControl: IMaterialGroup,
        groupWeapons: IMaterialGroup,
        groupMechanical: IMaterialGroup,
        groupOther: IMaterialGroup,
    }

    export interface IClasses extends IProp {
        _revision: number,
        asdf: null,
    }

}
