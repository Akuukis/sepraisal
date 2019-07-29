import { IBlueprint } from '@sepraisal/common'
import * as moment from 'moment'

// tslint:disable: no-object-literal-type-assertion

// tslint:disable:naming-convention
export namespace QUERIES_RAW {
    export const pendingScrapeError    = {'steam._error': {$exists: true}} as const
    export const pendingScrapeInitial  = {steam: {$exists: false}} as const
    export const pendingScrapeOutdated = {'steam._version': {$lt: IBlueprint.VERSION.steam}} as const
    export const pendingScrapeStale    = {'steam._updated': {$lt: moment().subtract(7, 'd').toDate()}} as const
    export const pendingScrape         = {$or: [
        pendingScrapeInitial,
        pendingScrapeOutdated,
        pendingScrapeStale,
    ]} as const

    export const pendingThumbError     = {'thumb._error': {$exists: true}} as const
    export const pendingThumbInitial   = {thumb: {$exists: false}} as const
    export const pendingThumbOutdated  = {'thumb._version': {$lt: IBlueprint.VERSION.thumb}} as const
    export const pendingThumbStale     = {$expr: {$ne: ['$thumb._revision', '$steam._thumbName']}} as const
    export const pendingThumb          = {$or: [
        pendingThumbInitial,
        pendingThumbOutdated,
        pendingThumbStale,
    ]} as const

    export const pendingPraiseError    = {'sbc._error': {$exists: true}} as const
    export const pendingPraiseInitial  = {sbc: {$exists: false}} as const
    export const pendingPraiseOutdated = {'sbc._version': {$lt: IBlueprint.VERSION.sbc}} as const
    export const pendingPraiseStale    = {$expr: {$ne: ['$sbc._revision', '$steam.revision']}} as const
    export const pendingPraise         = {$or: [
        pendingPraiseInitial,
        pendingPraiseOutdated,
        pendingPraiseStale,
    ]} as const

    export const pendingClassError     = {'classes._error': {$exists: true}} as const
    export const pendingClassInitial   = {classes: {$exists: false}} as const
    export const pendingClassOutdated  = {'classes._version': {$lt: IBlueprint.VERSION.classes}} as const
    export const pendingClassStale     = {$expr: {$ne: ['$classes._revision', '$steam.revision']}} as const
    export const pendingClass          = {$or: [
        pendingClassInitial,
        pendingClassOutdated,
        pendingClassStale,
    ]} as const

    export const errors = {$or: [
        pendingScrapeError,
        pendingThumbError,
        pendingPraiseError,
        pendingClassError,
    ]} as const

    export const initial = {$or: [
        pendingScrapeInitial,
        pendingThumbInitial,
        pendingPraiseInitial,
        pendingClassInitial,
    ]} as const

    export const outdated = {$or: [
        pendingScrapeOutdated,
        pendingThumbOutdated,
        pendingPraiseOutdated,
        pendingClassOutdated,
    ]} as const

    export const stale = {$or: [
        pendingScrapeStale,
        pendingThumbStale,
        pendingPraiseStale,
        pendingClassStale,
    ]} as const

    export const pending = {$or: [
        initial,
        outdated,
        stale,
    ]} as const

    export const ok = {$nor: [
        errors,
        pending,
    ]} as const
}

// tslint:disable: max-line-length
export namespace QUERIES {
    export const pendingScrapeError    = {...QUERIES_RAW.pendingScrapeError    }
    export const pendingThumbError     = {...QUERIES_RAW.pendingThumbError    , $nor: [QUERIES_RAW.pendingScrapeError] }
    export const pendingPraiseError    = {...QUERIES_RAW.pendingPraiseError   , $nor: [QUERIES_RAW.pendingScrapeError, QUERIES_RAW.pendingThumbError] }
    export const pendingClassError     = {...QUERIES_RAW.pendingClassError    , $nor: [QUERIES_RAW.pendingScrapeError, QUERIES_RAW.pendingThumbError, QUERIES_RAW.pendingPraiseError] }

    export const pendingScrape         = {...QUERIES_RAW.pendingScrape        , $nor: [QUERIES_RAW.errors] }
    export const pendingScrapeInitial  = {...QUERIES_RAW.pendingScrapeInitial , $nor: [QUERIES_RAW.errors] }
    export const pendingScrapeOutdated = {...QUERIES_RAW.pendingScrapeOutdated, $nor: [QUERIES_RAW.errors, QUERIES_RAW.pendingScrapeInitial] }
    export const pendingScrapeStale    = {...QUERIES_RAW.pendingScrapeStale   , $nor: [QUERIES_RAW.errors, QUERIES_RAW.pendingScrapeInitial, QUERIES_RAW.pendingScrapeOutdated] }

    export const pendingThumb          = {...QUERIES_RAW.pendingThumb         , $nor: [QUERIES_RAW.errors, QUERIES_RAW.pendingScrape] }
    export const pendingThumbInitial   = {...QUERIES_RAW.pendingThumbInitial  , $nor: [QUERIES_RAW.errors, QUERIES_RAW.pendingScrape] }
    export const pendingThumbOutdated  = {...QUERIES_RAW.pendingThumbOutdated , $nor: [QUERIES_RAW.errors, QUERIES_RAW.pendingScrape, QUERIES_RAW.pendingThumbInitial] }
    export const pendingThumbStale     = {...QUERIES_RAW.pendingThumbStale    , $nor: [QUERIES_RAW.errors, QUERIES_RAW.pendingScrape, QUERIES_RAW.pendingThumbInitial, QUERIES_RAW.pendingThumbOutdated] }

    export const pendingPraise         = {...QUERIES_RAW.pendingPraise        , $nor: [QUERIES_RAW.errors, QUERIES_RAW.pendingScrape, QUERIES_RAW.pendingThumb] }
    export const pendingPraiseInitial  = {...QUERIES_RAW.pendingPraiseInitial , $nor: [QUERIES_RAW.errors, QUERIES_RAW.pendingScrape, QUERIES_RAW.pendingThumb] }
    export const pendingPraiseOutdated = {...QUERIES_RAW.pendingPraiseOutdated, $nor: [QUERIES_RAW.errors, QUERIES_RAW.pendingScrape, QUERIES_RAW.pendingThumb, QUERIES_RAW.pendingPraiseInitial] }
    export const pendingPraiseStale    = {...QUERIES_RAW.pendingPraiseStale   , $nor: [QUERIES_RAW.errors, QUERIES_RAW.pendingScrape, QUERIES_RAW.pendingThumb, QUERIES_RAW.pendingPraiseInitial, QUERIES_RAW.pendingPraiseOutdated] }

    export const pendingClass          = {...QUERIES_RAW.pendingClass         , $nor: [QUERIES_RAW.errors, QUERIES_RAW.pendingScrape, QUERIES_RAW.pendingThumb, QUERIES_RAW.pendingPraise] }
    export const pendingClassInitial   = {...QUERIES_RAW.pendingClassInitial  , $nor: [QUERIES_RAW.errors, QUERIES_RAW.pendingScrape, QUERIES_RAW.pendingThumb, QUERIES_RAW.pendingPraise] }
    export const pendingClassOutdated  = {...QUERIES_RAW.pendingClassOutdated , $nor: [QUERIES_RAW.errors, QUERIES_RAW.pendingScrape, QUERIES_RAW.pendingThumb, QUERIES_RAW.pendingPraise, QUERIES_RAW.pendingClassInitial] }
    export const pendingClassStale     = {...QUERIES_RAW.pendingClassStale    , $nor: [QUERIES_RAW.errors, QUERIES_RAW.pendingScrape, QUERIES_RAW.pendingThumb, QUERIES_RAW.pendingPraise, QUERIES_RAW.pendingClassInitial, QUERIES_RAW.pendingClassOutdated] }
    export const errors = {...QUERIES_RAW.errors}
    export const ok = {...QUERIES_RAW.ok}

    export const pending = {...QUERIES_RAW.pending}
}
