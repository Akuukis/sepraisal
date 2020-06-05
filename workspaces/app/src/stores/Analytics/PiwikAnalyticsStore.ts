import { computed } from 'mobx'

import { AbstractAnalyticsStore, IAnalyticsStoreOpts } from './AbstractAnalyticsStore'


declare interface IWindowWithPiwik extends Window {
    _paq: unknown[][]
}
declare var window: IWindowWithPiwik & typeof globalThis


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

interface IPiwikStoreOpts extends IAnalyticsStoreOpts {
    clientTrackerName?: string,
    enableHeartBeatTimer?: boolean,
    enableLinkTracking?: boolean,
    injectScript?: boolean,
    serverTrackerName?: string,
    siteId?: number,
    updateDocumentTitle?: boolean,
    userId?: string | number,
}

export class PiwikAnalyticsStore extends AbstractAnalyticsStore {
    @computed public get isLoaded(): boolean {
        // This store sets `_paq` as simple Array.
        // Injected Piwik code will replace it with specialized class which is not Array.
        // TODO: Distinguish between 'not yet loaded' vs 'blocked by adblock'.
        return !Array.isArray(window._paq)
    }

    private updateDocumentTitle: boolean

    public constructor(rawOpts: IPiwikStoreOpts = {}) {
        super(rawOpts)
        const siteId = rawOpts.siteId
        const url = rawOpts.url
        const userId = rawOpts.userId
        const clientTrackerName = rawOpts.clientTrackerName ?? 'piwik.js'
        const enableLinkTracking = rawOpts.enableLinkTracking ?? true
        const enableHeartBeatTimer = rawOpts.enableHeartBeatTimer ?? true
        const injectScript = rawOpts.injectScript ?? true
        const serverTrackerName = rawOpts.serverTrackerName ?? 'piwik.php'
        this.updateDocumentTitle = rawOpts.updateDocumentTitle ?? true

        const trackViewHandler = this.trackView.bind(this)

        // Listen to History.pushState
        // The same behavior as with SimpleAnalytics - https://github.com/simpleanalytics/scripts/blob/4ad5c1b6cb4c42ae2e483dc43a578e25399d53a4/src/default.js#L120-L137.
        if (Event && window.dispatchEvent && window.history ? window.history.pushState : null) {
            var stateListener = (type: string) => {
                var orig = window.history[type]
                return function(this: History) {
                    var rv = orig.apply(this, arguments)
                    trackViewHandler(window.location)
                    return rv
                }
            }
            window.history.pushState = stateListener('pushState')
            window.addEventListener('pushState', () => {
                trackViewHandler(window.location)
            })
        }

        if (this._isShim) {
            this.push = (args: unknown[]) => console.debug(`PiwikAnalyticsStore.push():`, ...args)

            return
        }

        if (!piwikIsAlreadyInitialized()) {
            // tslint:disable-next-line: no-string-literal
            window['_paq'] = window['_paq'] || []

            const baseUrl = getBaseUrl(url!)
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

    public async getVisitorId(): Promise<string | null> {
        if(this._isShim) return 'localdevelopment'
        if(!this.isLoaded) return null

        return new Promise<string>((resolve, reject) => {
            // tslint:disable-next-line: no-any
            this.push([ function(this: any) {
                try {
                    // tslint:disable-next-line: no-unsafe-any
                    resolve(this.getVisitorId())
                } catch(err) {
                    reject(err)
                }
            }])
        })
    }

    /*
    * Pushes the specified args to the piwik tracker.
    * You can use this method as the low-level api to call methods from the piwik API or call custom functions
    *
    * @see https://developer.piwik.org/guides/tracking-javascript-guide
    */
    protected push(args: unknown[]) {
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
    public trackView(location: Location | {path: string} | Location & {basename: string}, documentTitle = document.title) {
        if (this.updateDocumentTitle) this.push(['setDocumentTitle', documentTitle])
        super.trackView(location)
    }

}
