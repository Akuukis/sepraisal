//            semver = 000.000.002
export const VERSION =           2
export const DB_URL = String(process.env.db_url)
export const DB_NAME = 'default'

export enum VENDOR_MOD {
    VANILLA = 'Vanilla',

    ECONOMY = 'Economy',
    FROSTBITE = 'Frostbite',
    DECORATIVE_1 = 'DecorativePack',
    DECORATIVE_2 = 'DecorativePack2',
    SPARKSOFTHEFUTURE = 'SparksOfTheFuturePack',
    SCRAPRACEPACK = 'ScrapRacePack',  // a.k.a. Wasteland
    WARFARE_1 = 'Warfare1',
    INDUSTRIAL = 'IndustrialPack',
}

export enum COMMUNITY_MOD {
}
