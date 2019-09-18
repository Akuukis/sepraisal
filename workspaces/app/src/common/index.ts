import BigNumber from 'bignumber.js'
import * as moment from 'moment'
import { useEffect, useState } from 'react'

export * from './Component'
export * from './ComponentRouted'
export * from './createFC'
export * from './myTheme'

// tslint:disable: no-submodule-imports
export { createStyles } from '@material-ui/core/styles'  // TODO: '@material-ui/styles'
export { GridSize } from '@material-ui/core/Grid'
// tslint:enable: no-submodule-imports

export const VERSION =           2
export const API_URL = 'http://db.spaceengineerspraisal.net/hello'


export const padTo2 = (value: number | string) => {
    const string = value.toString()
    if(string.length < 2) return padTo2(`0${string}`)

    return string
}

type NumberAlike = string | number | BigNumber
/**
 * Always give a valid number, and never ever give more than 4 decimals.
 */
const addCommasForThousands = (value: string, recursive = 3): string => {
    const oneCommaMore = value.toString().replace(/.*(?:\d\d|^\d)(?=(\d{3}))/g, '$&,')

    return recursive === 0 ? oneCommaMore : addCommasForThousands(oneCommaMore, recursive - 1)
}


export const formatDecimal = (amount: NumberAlike, dp: number = 0): string => {
    const bn = new BigNumber(amount)

    return addCommasForThousands(bn.toFixed(dp))
}

/**
 * - `499` -> `499`
 * - `500` -> `0.5k`
 * - `9999` -> `9.9k`
 * - `10000` -> `10k`
 * - `499999` -> `499k`
 * - `500000` -> `0.5m`
 */
export const formatFloat = (amount: NumberAlike): string => {
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

    return `${scaled.toFixed(scaled.lt(10) ? 1 : 0)}${scale}`
}

export const formatDuration = (seconds: number): string => {
    const zero = moment.unix(0).utc()
    const time = moment.unix(seconds).utc()
    const diff = time.diff(zero, 's')

    let res = ''
    res = `${padTo2(Math.floor(diff                % 60))}${res}`
    if(Math.floor(diff / 60) === 0) return res

    res = `${padTo2(Math.floor(diff / 60           % 60))}:${res}`
    if(Math.floor(diff / 60 / 60) === 0) return res

    res = `${padTo2(Math.floor(diff / 60 / 60      % 24))}:${res}`
    if(Math.floor(diff / 60 / 60 / 24) === 0) return res

    res = `${padTo2(Math.floor(diff / 60 / 60 / 24))}d ${res}`

    return res
}

export const useAsyncEffectOnce = (afn: () => Promise<void>) => {
    useEffect(() => {
        afn().catch((err) => console.error(`Async Effect "${afn.name}" failed:`, err))
    }, [])
}

// tslint:disable-next-line: naming-convention no-object-literal-type-assertion
export const ASYNC_STATE = {
    Idle: 0,

    Doing: 1,

    Done: 2,

    Error: 3,
} as const
// tslint:disable-next-line: naming-convention
export type ASYNC_STATE =
    | typeof ASYNC_STATE['Idle']
    | typeof ASYNC_STATE['Doing']
    | typeof ASYNC_STATE['Done']
    | typeof ASYNC_STATE['Error']

export const DUD_URL = 'javascript:;'
