import BigNumber from 'bignumber.js'
import moment from 'moment'
import { DependencyList, useEffect, useState } from 'react'

import { API_URL } from 'src/constants'
import { FindQuery, IFindRootQuery } from 'src/models'

export * from './Component'
export * from './ComponentRouted'
export * from './blockGroups'
export * from './createFC'
export * from './myTheme'
export * from './vega'

export { createStyles } from '@material-ui/core/styles'  // TODO: '@material-ui/styles'
export { GridSize } from '@material-ui/core/Grid'

export const padTo2 = (value: number | string): string => {
    const string = value.toString()
    if(string.length < 2) return padTo2(`0${string}`)

    return string
}

export type GridSizeColumns = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

type NumberAlike = string | number | BigNumber
/**
* Always give a valid number, and never ever give more than 4 decimals.
*/
const addThousandSeperators = (value: string, seperator = '\u2009', recursive = 4): string => {
    const oneCommaMore = value.toString().replace(/.*(?:\d\d|^\d)(?=(\d{3}))/g, `$&${seperator}`)

    return recursive === 0 ? oneCommaMore : addThousandSeperators(oneCommaMore, seperator, recursive - 1)
}


export const formatDecimal = (amount: NumberAlike, dp = 0): string => {
    const bn = new BigNumber(amount)

    return addThousandSeperators(bn.toFixed(dp))
}

/**
* - `499` -> `499`
* - `500` -> `0.5k`
* - `9999` -> `9.9k`
* - `10000` -> `10k`
* - `499999` -> `499k`
* - `500000` -> `0.5m`
*/
export const formatFloat = (amount: NumberAlike, wholeNumbers = true): string => {
    const raw = new BigNumber(amount)
    let scaled: BigNumber
    let scale: string

    if(raw.lt(500)) {
        scaled = raw
        scale = ''
    } else if(raw.lt(500 * 1000)) {
        scaled = raw.div(1000)
        scale = 'K'
    } else if(raw.lt(500 * 1000 * 1000)) {
        scaled = raw.div(1000).div(1000)
        scale = 'M'
    } else if(raw.lt(500 * 1000 * 1000 * 1000)) {
        scaled = raw.div(1000).div(1000).div(1000)
        scale = 'T'
    } else if(raw.lt(500 * 1000 * 1000 * 1000 * 1000)) {
        scaled = raw.div(1000).div(1000).div(1000).div(1000)
        scale = 'P'
    } else if(raw.lt(500 * 1000 * 1000 * 1000 * 1000 * 1000)) {
        scaled = raw.div(1000).div(1000).div(1000).div(1000).div(1000)
        scale = 'E'
    } else if(raw.lt(500 * 1000 * 1000 * 1000 * 1000 * 1000 * 1000)) {
        scaled = raw.div(1000).div(1000).div(1000).div(1000).div(1000).div(1000)
        scale = 'Z'
    } else {
        scaled = raw.div(1000).div(1000).div(1000).div(1000).div(1000).div(1000).div(1000)
        scale = 'Y'
    }

    return wholeNumbers
        ? `${scaled.toFixed(scaled.lt(10) && raw.gt(10) ? 1 : 0)}${scale}`
        : `${scaled.toFixed(scaled.lt(10) ? 1 : 0)}${scale}`
}

export const formatDuration = (seconds: number): string => {
    const zero = moment.unix(0).utc()
    const time = moment.unix(seconds).utc()

    if(time.isAfter(moment.unix(0).utc().add(1, 'day'))) {
        const days = time.diff(zero, 'days')
        return `${days}d ${time.subtract(days, 'days').diff(zero, 'hour')}h`
    }

    if(time.isAfter(moment.unix(0).utc().add(1, 'hour'))) {
        const hour = time.diff(zero, 'hour')
        return `${hour}h ${time.subtract(hour, 'hours').diff(zero, 'minute')}m`
    }

    if(time.isAfter(moment.unix(0).utc().add(1, 'minute'))) {
        const minutes = time.diff(zero, 'minutes')
        return `${minutes}m ${time.subtract(minutes, 'minutes').diff(zero, 'second')}s`
    }

    return `${time.diff(zero, 'second')}s`
}

export const useAsyncEffect = (afn: () => Promise<void>, deps?: DependencyList): void => {
    useEffect(() => {
        afn().catch((err) => console.error(`Async Effect "${afn.name}" failed:`, err))
    }, deps)
}
export const useAsyncEffectOnce = (afn: () => Promise<void>): void => useAsyncEffect(afn, [])

export const ASYNC_STATE = {
    Idle: 0,

    Doing: 1,

    Done: 2,

    Error: 3,
} as const
export type ASYNC_STATE =
    | typeof ASYNC_STATE['Idle']
    | typeof ASYNC_STATE['Doing']
    | typeof ASYNC_STATE['Done']
    | typeof ASYNC_STATE['Error']


export const linkBp = (id: number): string => `https://steamcommunity.com/sharedfiles/filedetails/?id=${id}`
export const linkAuthor = (idOrProfile: string | number): string => `https://steamcommunity.com/${idOrProfile}/myworkshopfiles/?appid=244850`
export const linkCollection = (id: string | number): string => `https://steamcommunity.com/workshop/filedetails/?id=${id}`

interface ILinkProps {
    href: string
    target: string
    rel: string
}
export const linkProps = (href: string): ILinkProps => ({href, target: '_blank', rel: 'noreferrer noopener'})
export const linkBpProps = (id: number): ILinkProps => linkProps(linkBp(id))
export const linkAuthorProps = (id: string | number): ILinkProps => linkProps(linkAuthor(id))
export const linkCollectionProps = (id: string | number): ILinkProps => linkProps(linkCollection(id))


/**
* As hacky for material-ui paper shadows as it can be: don't use elsewhere!
*
* Example (elevation 16):
*     IN: "0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)"
*     OUT:
*/
export const dropShadowFromBoxShadow = (css: string): string => {
    const boxShadows = css.match(/(\w+ \S+ \S+ \S+ \S+?\))/g) as string[]
    const dropShadows = boxShadows.map((boxShadow) => {
        const part = boxShadow.split(' ')
        return `drop-shadow(${part[0]} ${part[1]} ${part[2]} ${part[4]})`
    })

    return dropShadows.join(' ')
}

interface IWindowDimensions {
    width: number
    height: number
}
const getWindowDimensions = (): IWindowDimensions => {
    const { innerWidth: width, innerHeight: height } = window
    return {
        width,
        height
    }
}

export const useWindowDimensions = (): IWindowDimensions => {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions())

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions())
        }

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return windowDimensions
}

interface ApiProps {
    $search?: string,
    projection?: Record<string, unknown>,
    sort?: Record<string, unknown>,
    limit?: number,
    skip?: number,
}
export const getApiUrl = (queries: FindQuery[], {$search,projection,sort,limit,skip}: ApiProps): string => {
    const find: IFindRootQuery = {$and: queries}
    if($search) find.$text = {$search}

    const searchParams = new URLSearchParams()
    searchParams.set('find', JSON.stringify(find))
    if(projection   ) searchParams.set('projection', JSON.stringify(projection))
    if(sort         ) searchParams.set('sort', JSON.stringify(sort))
    if(skip         ) searchParams.set('skip', JSON.stringify(skip))
    if(limit        ) searchParams.set('limit', JSON.stringify(limit))

    return `${API_URL}?${searchParams.toString()}`
}

export interface IBlogArticle {
    id: string,
    title: string,
    authors: string[],
    date: moment.Moment
    link: string
}
