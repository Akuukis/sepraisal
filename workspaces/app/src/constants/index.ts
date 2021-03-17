export enum ROUTE {
    HOME = '/',
    ANALYSE = '/analyse',
    BROWSE = '/browse',
    COMPARE = '/compare',
    BLOG = '/blog',
    INFO = '/info',
}

export enum PROVIDER {
    STEAM = 'steam',
    LOCAL = 'upload',
    MODIO = 'modio',
}

export enum BROWSE_PARTS {
    SEARCH = 'search',
    AUTHOR = 'author',
    COLLECTION = 'collection',
    FILTER = 'filter',
    SORT = 'sort',
}

/* eslint-disable @typescript-eslint/no-non-null-assertion */  // Validated by dotenv/config.
export const API_URL = process.env.API!
export const MATOMO_PARAMS = {
    siteId: Number(process.env.MATAMO_SITE_ID!),
    url: process.env.MATAMO_URL!,
} as const
export const SIMPLE_ANALYTICS_PARAMS = {
    url: process.env.SIMPLE_ANALYTICS_URL!,
} as const
export const GOAT_COUNTER_PARAMS = {
    url: process.env.GOAT_COUNTER_URL!,
} as const
