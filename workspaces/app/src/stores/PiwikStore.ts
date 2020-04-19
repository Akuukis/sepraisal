import { join } from 'path'


declare interface IWindowWithPiwik extends Window {
    _paq: unknown[][]
}
declare var window: IWindowWithPiwik & typeof globalThis

const noop = () => undefined

const getEnvironment = () => {
    // tslint:disable-next-line: strict-boolean-expressions
    return process && process.env && process.env.NODE_ENV ? process.env.NODE_ENV.toLowerCase() : 'development'
}

const getBaseUrl = (url: string) => {
    if(url.indexOf('http://') !== -1 || url.indexOf('https://') !== -1) {
        return `${url}/`
    }

    return `http${document.location.protocol === 'https:' ? 's' : ''}://${url}`
}

const piwikIsAlreadyInitialized = () => {
    // tslint:disable-next-line: no-unbound-method
    if (typeof window._paq === 'undefined' || typeof window._paq.push !== 'function') {
        return false
    }

    if (window._paq.length === undefined) {
        // piwik seems to have replaced the array by the TrackerProxy
        // @see https://github.com/piwik/piwik/blob/3.x-dev/js/piwik.js#L7050
        // @see https://github.com/piwik/piwik/blob/3.x-dev/js/piwik.js#L7115
        return true
    }

    let hasSiteId = false
    let hasTrackerUrl = false
    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < window._paq.length; i += 1) {
        if (window._paq[i].indexOf('setSiteId') !== -1) {
            hasSiteId = true
        }

        if (window._paq[i].indexOf('setTrackerUrl') !== -1) {
            hasTrackerUrl = true
        }

        if (hasTrackerUrl && hasSiteId) {
            return true
        }
    }

    return false
}

interface IPiwikStoreOpts {
    clientTrackerName?: string,
    enableHeartBeatTimer?: boolean,
    enableLinkTracking?: boolean,
    injectScript?: boolean,
    serverTrackerName?: string,
    siteId?: number,
    trackErrorHandler?: PiwikStore['trackError'],
    trackErrors?: boolean,
    updateDocumentTitle?: boolean,
    url?: string,
    userId?: string | number,
}

// tslint:disable-next-line: min-class-cohesion
export class PiwikStore {
    // tslint:disable-next-line: naming-convention
    public readonly _isShim: boolean = false

    private listeners: Array<() => void> = []
    private previousPath = ''
    private updateDocumentTitle: boolean

    // tslint:disable-next-line: mccabe-complexity cognitive-complexity
    public constructor(rawOpts: IPiwikStoreOpts = {}) {
        const siteId = rawOpts.siteId
        const url = rawOpts.url
        const userId = rawOpts.userId
        const clientTrackerName = rawOpts.clientTrackerName ?? 'piwik.js'
        const enableLinkTracking = rawOpts.enableLinkTracking ?? true
        const enableHeartBeatTimer = rawOpts.enableHeartBeatTimer ?? true
        const injectScript = rawOpts.injectScript ?? true
        const serverTrackerName = rawOpts.serverTrackerName ?? 'piwik.php'
        const trackErrorHandler = rawOpts.trackErrorHandler ?? this.trackError.bind(this) as PiwikStore['trackError']
        const trackErrors = rawOpts.trackErrors ?? false
        this.updateDocumentTitle = rawOpts.updateDocumentTitle ?? true

        if (trackErrors) {
            if (window.addEventListener) {
                window.addEventListener('error', trackErrorHandler, false)
                this.listeners.push(() => window.removeEventListener('error', trackErrorHandler))
            } else {
                const prev = window.onerror
                window.onerror = trackErrorHandler
                this.listeners.push(() => window.onerror = prev)
            }
        }

        const alreadyInitialized = piwikIsAlreadyInitialized()
        if (!alreadyInitialized) {

            // tslint:disable-next-line: no-string-literal
            window['_paq'] = window['_paq'] || []

            if (typeof url !== 'string' || typeof siteId !== 'number' || !injectScript) {
                // Only return warning if this is not in the test environment as it can break the Tests/CI.
                if (getEnvironment() !== 'test') {
                    console.warn('PiwikTracker cannot be initialized! You haven\'t passed a url and siteId to it.')
                }

                // api shim. used for serverside rendering and misconfigured tracker instances
                this._isShim = true
                // this.track = noop
                this.push = (arg) => console.debug(`PIWIK.push():`, arg)
                this.setUserId = noop
                this.trackError = noop

                return
            }

            const baseUrl = getBaseUrl(url)
            this.push(['setSiteId', siteId])
            this.push(['setTrackerUrl', `${baseUrl}${serverTrackerName}`])

            if(injectScript) {
                const firstScript = document.getElementsByTagName('script')[0]
                const element = document.createElement('script')
                element.type = 'text/javascript'
                element.defer = true
                element.async = true
                element.src = `${baseUrl}${clientTrackerName}`
                // tslint:disable-next-line: no-useless-cast no-non-null-assertion
                firstScript.parentNode!.insertBefore(element, firstScript)
            }
        }

        if (userId !== undefined) {
            this.setUserId(userId)
        }

        if (enableLinkTracking) {
            this.push(['enableLinkTracking'])
        }

        if (enableHeartBeatTimer) {
            this.push(['enableHeartBeatTimer'])
        }

    }

    public deconstructor() {
        this.listeners.forEach((listener) => listener())
    }

    /*
     * Pushes the specified args to the piwik tracker.
     * You can use this method as the low-level api to call methods from the piwik API or call custom functions
     *
     * @see https://developer.piwik.org/guides/tracking-javascript-guide
     */
    public push(args: unknown[]) {
        // tslint:disable-next-line: no-string-literal
        window['_paq'].push(args)
    }

    /**
     * Sets a user ID to the piwik tracker.
     * This method can be used after PiwikReactRouter is instantiated, for example after a user has logged in
     *
     * @see https://developer.piwik.org/guides/tracking-javascript-guide#user-id
     */
    public setUserId(userId: string | number) {
        window._paq.push(['setUserId', userId])
    }

    /**
     * Adds a page view for the given location
     */
    public track(location: Location | {path: string} | Location & {basename: string}, documentTitle = document.title) {
        let currentPath: string

        if ('path' in location) {
            currentPath = location.path
        } else if ('basename' in location) {
            currentPath = join(location.basename, location.pathname, location.search)
        } else {
            currentPath = join(location.pathname, location.search)
        }

        if (this.previousPath === currentPath) {
            return
        }

        if (this.updateDocumentTitle) {
            this.push(['setDocumentTitle', documentTitle])
        }
        this.push(['setCustomUrl', currentPath])
        this.push(['trackPageView'])

        this.previousPath = currentPath
    }

    /**
     * Tracks occurring javascript errors as a `JavaScript Error` piwik event.
     *
     * @see http://davidwalsh.name/track-errors-google-analytics
     */
    // tslint:disable: max-func-args
    public trackError(event: Event | string, source?: string, lineno?: number, colno?: number, error?: Error): void
    public trackError(errorEvent: ErrorEvent, eventName?: string): void
    public trackError(eventSomething: ErrorEvent | Event | string, sourceOrEventName?: string, lineno?: number, colno?: number, error?: Error): void {
        if(typeof eventSomething === 'string') {
            this.push([
                'trackEvent',
                'JavaScript Error',
                eventSomething,
                `${sourceOrEventName}:${lineno}:${colno}`,
            ])
        } else if(!('message' in eventSomething)) {
            this.push([
                'trackEvent',
                'JavaScript Error',
                error!.message,  // tslint:disable-line: no-useless-cast no-non-null-assertion
                `${sourceOrEventName}:${lineno}:${colno}`,
            ])
        } else {
            this.push([
                'trackEvent',
                sourceOrEventName ?? 'JavaScript Error',
                eventSomething.message,
                `${eventSomething.filename}:${eventSomething.lineno}`,
            ])

        }
    }

}
