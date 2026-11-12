import { exec, execSync } from 'child_process'
import { existsSync, lstat, Stats } from 'fs'
import { FilterQuery } from 'mongodb'
import { dirname, join } from 'path'
import scrapeIt from 'scrape-it'


export const execAsync = async (cmd: string): Promise<string> =>
    new Promise<string>((res, rej) => exec(cmd, (err, str) => err ? rej(err) : res(str)))

export const execAsyncBuffer = async (cmd: string): Promise<Buffer> =>
    new Promise<Buffer>((res, rej) => exec(cmd, {encoding: 'buffer'}, (err, buf) => err ? rej(err) : res(buf)))

export const lstatAsync = async (path: string): Promise<false | Stats> =>
    new Promise<false | Stats>((res) => lstat(path, (err, stats) => res(err instanceof Error ? false : stats)))

const {
    crawler_user,
    crawler_steam_dir,
    crawler_downloads_dir,
    crawler_steam_cookie_file,
    crawler_https_proxy,
    steam_username,
} = process.env
if(crawler_user === undefined
    || crawler_steam_dir === undefined
    || crawler_downloads_dir === undefined
    || steam_username === undefined
) {
    throw new Error(`Missing environment variables, check your ".env" file.`)
}

export const STEAM_USERNAME = steam_username
export const STEAM_DIR = crawler_steam_dir
export const STEAM_COOKIE_FILE = crawler_steam_cookie_file
export const STEAM_HTTPS_PROXY = crawler_https_proxy

const shellEscape = (input: string): string => `'${input.replace(/'/g, `'\\''`)}'`
const STEAM_WEB_USER_AGENT = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36'
const STEAM_CURL_FLAGS = '--connect-timeout 20 --max-time 40'
const normalizeProxy = (proxy: string): string =>
    proxy.includes('://') ? proxy : `http://${proxy}`
const steamCookieFlags = STEAM_COOKIE_FILE
    ? ` -b ${shellEscape(STEAM_COOKIE_FILE)} -c ${shellEscape(STEAM_COOKIE_FILE)}`
    : ''
const steamProxyFlags = STEAM_HTTPS_PROXY
    ? ` --proxy ${shellEscape(normalizeProxy(STEAM_HTTPS_PROXY))}`
    : ''
let steamLoginPromise: Promise<void> | null = null
let steamWebQueue: Promise<void> = Promise.resolve()
const sleepMs = async (ms: number): Promise<void> =>
    new Promise<void>((resolve) => setTimeout(resolve, ms))
const STEAM_WEB_REQUEST_DELAY_MS = 5000

const isSteamRetryableError = (err: Error): boolean => {
    const message = String(err.message)

    return message.includes('curl: (28)')
        || (message.includes('curl: (22)') && message.includes(' 429'))
}

const withSteamRetry = async <T>(fn: () => Promise<T>): Promise<T> => {
    const maxAttempts = 3

    for(let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await fn()
        } catch(err) {
            if(!(err instanceof Error) || !isSteamRetryableError(err) || attempt === maxAttempts) throw err
            await sleepMs(attempt * 5000)
        }
    }

    throw new Error('Unreachable retry state.')
}

const throttleSteamWebRequest = async <T>(fn: () => Promise<T>): Promise<T> => {
    const previous = steamWebQueue
    let releaseQueue = (): void => {/* */}
    steamWebQueue = new Promise<void>((resolve) => {
        releaseQueue = resolve
    })

    await previous

    try {
        const result = await withSteamRetry(fn)
        await sleepMs(STEAM_WEB_REQUEST_DELAY_MS)

        return result
    } finally {
        releaseQueue()
    }
}

export const asCrawlerUser = (cmd: string): string => {
    const whoami = execSync(`whoami`).toString().trim()

    return whoami === crawler_user ? cmd : `sudo su ${crawler_user} -c ${shellEscape(cmd)}`
}

export const ensureSteamCmdLogin = async (): Promise<void> => {
    if(steamLoginPromise) return steamLoginPromise

    steamLoginPromise = execAsync(asCrawlerUser(`steamcmd +login ${STEAM_USERNAME} +exit`))
        .then(() => undefined)
        .catch((err) => {
            steamLoginPromise = null
            throw err
        })

    return steamLoginPromise
}

export const isSteamAccessDenied = (html: string): boolean =>
    /<title>\s*access denied\s*<\/title>/i.test(html) || html.includes('errors.edgesuite.net')

export const steamFetchHtml = async (url: string): Promise<string> => {
    await ensureSteamCmdLogin()

    const html = await throttleSteamWebRequest(() => execAsync([
        'curl -fsSL --compressed',
        STEAM_CURL_FLAGS,
        `-A ${shellEscape(STEAM_WEB_USER_AGENT)}`,
        '-H "Accept-Language: en-US,en;q=0.9"',
        '-H "Cache-Control: no-cache"',
        steamCookieFlags,
        steamProxyFlags,
        shellEscape(url),
    ].join(' ')))

    if(isSteamAccessDenied(html)) {
        throw new Error(`Steam access denied for ${url}`)
    }

    return html
}

export const steamDownloadFile = async (url: string, destination: string): Promise<void> => {
    await ensureSteamCmdLogin()

    await throttleSteamWebRequest(() => execAsync([
        'curl -fsSL --compressed',
        STEAM_CURL_FLAGS,
        `-A ${shellEscape(STEAM_WEB_USER_AGENT)}`,
        '-H "Accept-Language: en-US,en;q=0.9"',
        '-H "Cache-Control: no-cache"',
        steamCookieFlags,
        steamProxyFlags,
        `-o ${shellEscape(destination)}`,
        shellEscape(url),
    ].join(' ')))
}

export const scrapeHtml = <T>(html: string, opts: unknown): T =>
    (scrapeIt as unknown as {scrapeHTML(html: string, opts: unknown): {data: T}}).scrapeHTML(html, opts).data

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
