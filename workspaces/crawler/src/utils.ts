import { exec } from 'child_process'
import { lstat, Stats } from 'fs'
import { FilterQuery } from 'mongodb'
import { join } from 'path'


export const execAsync = async (cmd: string) =>
    new Promise<string>((res, rej) => exec(cmd, (err, str) => err ? rej(err) : res(str)))

export const execAsyncBuffer = async (cmd: string) =>
    new Promise<Buffer>((res, rej) => exec(cmd, {encoding: 'buffer'}, (err, buf) => err ? rej(err) : res(buf)))

export const lstatAsync = async (path: string) =>
    new Promise<false | Stats>((res, rej) => lstat(path, (err, stats) => res(err instanceof Error ? false : stats)))

// tslint:disable-next-line: naming-convention
const {steam_dir, sbc_dir, thumb_dir, steam_username} = process.env
if(steam_dir === undefined
    || sbc_dir === undefined
    || thumb_dir === undefined
    || steam_username === undefined
) {
    throw new Error(`Missing environment variables, check your ".env" file.`)
}
export const STEAM_USERNAME = steam_username
export const STEAM_DIR = steam_dir
export const SBC_DIR = sbc_dir
export const THUMB_DIR = thumb_dir

export const sbcName = (datum: {_id: number, steam: {revision: number}}) => `${datum._id}.${datum.steam.revision}.zip`
export const sbcPath = (datum: {_id: number, steam: {revision: number}}) => join(SBC_DIR, sbcName(datum))

export const prepareQuery = <TProjection extends object>(query: {$nor: unknown[]}) => {

    if(process.argv.includes('--force')) {  // Use '--force' to ignore errored cases.
        // tslint:disable-next-line: no-object-literal-type-assertion
        return {...query, $nor: query.$nor.slice(1)} as FilterQuery<TProjection>
    }

    return query as FilterQuery<TProjection>
}
