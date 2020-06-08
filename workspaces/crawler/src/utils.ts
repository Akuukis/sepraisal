import { exec, execSync } from 'child_process'
import { existsSync, lstat, Stats } from 'fs'
import { FilterQuery } from 'mongodb'
import { dirname, join } from 'path'


export const execAsync = async (cmd: string): Promise<string> =>
    new Promise<string>((res, rej) => exec(cmd, (err, str) => err ? rej(err) : res(str)))

export const execAsyncBuffer = async (cmd: string): Promise<Buffer> =>
    new Promise<Buffer>((res, rej) => exec(cmd, {encoding: 'buffer'}, (err, buf) => err ? rej(err) : res(buf)))

export const lstatAsync = async (path: string): Promise<false | Stats> =>
    new Promise<false | Stats>((res) => lstat(path, (err, stats) => res(err instanceof Error ? false : stats)))

const {crawler_user, crawler_steam_dir, crawler_downloads_dir, steam_username} = process.env
if(crawler_user === undefined
    || crawler_steam_dir === undefined
    || crawler_downloads_dir === undefined
    || steam_username === undefined
) {
    throw new Error(`Missing environment variables, check your ".env" file.`)
}

export const STEAM_USERNAME = steam_username
export const STEAM_DIR = crawler_steam_dir

export const asCrawlerUser = (cmd: string): string => {
    const whoami = execSync(`whoami`).toString().trim()

    return whoami === crawler_user ? cmd : `sudo su ${crawler_user} -c '${cmd}'`
}

export const sbcName = (datum: {_id: number, steam: {revision: number}}): string => `${datum._id}.${datum.steam.revision}.zip`
export const sbcPath = (datum: {_id: number, steam: {revision: number}}): string => join(crawler_downloads_dir, 'steam-sbc', sbcName(datum))
export const thumbName = (idPair: string): string => `${idPair.replace('/', '_')}.jpg`  // JPG is a lie, it may be PNG or GIF too.
export const thumbPath = (idPair: string): string => join(crawler_downloads_dir, 'steam-thumb', thumbName(idPair))
export const thumbLink = (idPair: string): string => [
        `https://steamuserimages-a.akamaihd.net/ugc`,
        ...idPair.split('-'),
        `?imw=268&imh=151&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=true`,
    ].join('/')

export const mkdirpSync = (path: string): boolean => {
    if(!existsSync(dirname(path))) {
        execSync((`mkdir -p ${dirname(path)}`))
        return true
    } else {
        return false
    }
}

export const prepareQuery = <TProjection extends unknown>(query: {$nor: unknown[]}): FilterQuery<TProjection> => {

    if(process.argv.includes('--force')) {  // Use '--force' to ignore errored cases.
        return {...query, $nor: query.$nor.slice(1)} as FilterQuery<TProjection>
    }

    return query as FilterQuery<TProjection>
}
