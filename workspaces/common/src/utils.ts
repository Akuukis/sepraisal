import { BigNumber as BN } from 'bignumber.js'
import pad from 'pad'
import { PromiseType } from 'utility-types'

// tslint:disable:max-line-length
// tslint:disable:no-void-expression id-length

export const ZERO = new BN(0)
export const ONE = new BN(1)

export type Await<T extends UnknownAsyncFunction> = PromiseType<ReturnType<T>>

export type IConstructor<T, TA = unknown> = new(...args: TA[]) => T

export type ClassDecoratorFixed<T> = <TFn extends IConstructor<T> = IConstructor<T>>(target: TFn) => TFn | void
export type UnknownFunction<TArgs extends unknown[] = []> = (...args: TArgs) => unknown
export type UnknownAsyncFunction<TArgs extends unknown[] = []> = (...args: TArgs) => Promise<unknown>
export type RequiredSome<T, TKey extends keyof T = keyof T> = T & { [TProp in TKey]-?: T[TProp]; }

export type ConstructorTypes<T> = T extends IConstructor<unknown, infer Args> ? Args : never

export const toMinSec = (duration: number): string => `${(duration / 60).toFixed(0)}m${pad(2, (duration % 60).toFixed(0))}s`
export const idFromHref = (href: string): number => {
    const match = href.match(/id=(\d+)/)
    if(!match) throw new Error(`Can't extract id from href: "${href}"`)

    return Number(match[1])
}

export type Work<TA extends unknown[]> = (...args: TA) => Promise<void>
export const Worker = <T extends unknown[]>(work: Work<T>, errors?: Error[]) => async <U>(works: T[], track: U): Promise<U> => {
    // eslint-disable-next-line no-constant-condition
    while(true) {
        const params = works.shift()
        if(!params) return track
        // tslint:disable-next-line:try-catch-first
        try {
            await work(...params)
        } catch(err) {
            if(errors) errors.push(err)
            console.error((err as Error).message)
        }
    }
}

export const sleep = async (seconds: number): Promise<void> => new Promise<never>((resolve) => setTimeout(() => resolve(), seconds * 1000))
export const timebomb = async (seconds: number): Promise<never> => new Promise<never>((_, reject) => setTimeout(() => reject(new Error('Timeouted.')), seconds * 1000))
export const timeout = async <TRes>(seconds: number, promise: Promise<TRes>): Promise<TRes> => Promise.race([promise, timebomb(seconds)])

export const mapToRecord = <TKey extends string | number | symbol, TValue extends unknown>(map: Map<TKey, TValue>): Record<TKey, TValue> => {
    const entries = [...map.entries()]
    const record = Object.create(null) as Record<TKey, TValue>
    for(const [key, value] of entries) record[key] = value

    return record
}

export const noop = (): void => {/* */}
