import './GoatCounterJs'

import { AbstractAnalyticsStore, IAnalyticsStoreOpts } from './AbstractAnalyticsStore'

interface IGoatCounterSettings {
    /**
     * Don’t do anything on page load. If you want to call count() manually. Also won’t bind events.
     */
    no_onload: boolean,
    /**
     * Don’t bind click events.
     */
    no_events: boolean,
    /**
     * Allow requests from local addresses (localhost, 192.168.0.0, etc.) for testing the integration locally.
     */
    allow_local: boolean,
    /**
     * Allow requests when the page is loaded in a frame or iframe.
     */
    allow_frame: boolean,
    /**
     * Customize the endpoint for sending pageviews to; see Setting the endpoint in JavaScript .
     */
    endpoint?: string,
}

interface IGoatCounterVars {
    /**
     * Page path (without domain) or event name.
     * Default is the value of `<link rel="canonical">` if it exists, or `location.pathname + location.search`.
     */
    path?: string | (() => string),
    /**
     * Human-readable title. Default is `document.title`.
     */
    title?: string | (() => string),
    /**
     * Where the user came from; can be an URL (https://example.com) or any string `(June Newsletter)`.
     * Default is to use the Referer header.
     */
    referrer?: string | (() => string),
    /**
     * Treat the path as an event, rather than a URL. Boolean.
     */
    event?: boolean | (() => boolean),
}

interface GoatCounter extends IGoatCounterSettings, IGoatCounterVars {
    /**
     * Send a pageview or event to GoatCounter.
     * the vars parameter is an object as described in the Data section above,
     * and will be merged in to the global window.goatcounter, taking precedence.
     *
     * Be aware that the script is loaded with async by default,
     * so count() may not yet be available on click events and the like.
     * Use setInterval() to wait until it's available:
     *
     *    elem.addEventListener('click', function() {
     *        var t = setInterval(function() {
     *            if (window.goatcounter && window.goatcounter.count) {
     *                clearInterval(t)
     *                goatconter.count()
     *            }
     *        }, 100)
     *    })
     *
     * The default implementation already handles this, and you only need to worry about this if you call count() manually.
     */
    count(vars?: IGoatCounterVars): void
    /**
     * Get URL to send to the server; the vars parameter behaves as count().
     *
     * Note that you may want to use filter() to exclude prerender requests and various other things.
     */
    url(vars?: IGoatCounterVars): string
    /**
     * Determine if this request should be filtered; this returns a string with the reason or false.
     *
     * This will filter pre-render requests, frames (unless allow_frame is set), and local requests (unless allow_local is set).
     */
    filter(): string | false
    /**
     * Bind a click event to every element with data-goatcounter-click.
     * Called on page load unless no_onload or no_events is set.
     * You may need to call this manually if you insert elements after the page loads.
     */
    bind_events(): void
    /**
     * Get a single query parameter from the current page's URL; returns undefined if the parameter doesn't exist.
     * This is useful if you want to get the referrer from the URL:
     *
     * Note there is also a Campaign Parameters setting, which is probably easier for most people.
     * This is just if you want to get the campaign on only some pages, or want to do some more advanced filtering (such as only including your own campaigns).
     */
    get_query(name: string): string
}

declare interface IWindowWithGoatCounter extends Window {
    goatcounter: GoatCounter
}
declare let window: IWindowWithGoatCounter & typeof globalThis

const goatCounterAlreadyInitialized = () => {
    return window.goatcounter && typeof window.goatcounter.count  === 'function'
}


interface IGoatCounterStoreOpts extends IAnalyticsStoreOpts {
}

export class GoatCounterStore extends AbstractAnalyticsStore {

    public constructor(rawOpts: IGoatCounterStoreOpts = {}) {
        super(rawOpts)

        window.goatcounter.endpoint = rawOpts.url
        window.goatcounter.allow_local = true

        // window.onload = () => {
        //     this.trackView(window.location);
        // }

        const autocount = () => {
            this.countSafe()
            // console.log('adsf')
            // this.countSafe()
            // window.goatcounter?.count({
            //     path: location.pathname + location.search + location.hash,
            // })
        }
        window.addEventListener('pushState', autocount)
        this.listeners.push(() => window.removeEventListener('pushState', autocount))
        autocount()  // Initial load.
    }

    protected push([type, ...opts]: ['trackPageView' | 'trackEvent' | 'trackSiteSearch', string?, string?, (string | number)?, (string | number)?]): void {
        switch(type) {
            case('trackPageView'): {
                return this.countSafe()
            }
            case('trackSiteSearch'): {
                return this.countSafe({
                    event: true,
                    path: 'search',
                    title: opts[0],
                })
            }
            case('trackEvent'): {
                return this.countSafe({
                    event: true,
                    path: opts.slice(0, 2).join('__'),
                    title: String(opts[3] ?? opts[2]),
                })
            }
            default: throw new Error(`GoatCounterStore: unknown type "${type}"`)
        }
    }

    protected countSafe(vars?: IGoatCounterVars): void {
        if(this._isShim) console.debug(`GoatCounterStore.countSafe(${vars ? JSON.stringify(vars) : ''}) -> ${window.goatcounter.url(vars)}`)
        window.goatcounter.count({
            ...vars,
            path: vars?.path ?? location.pathname,
        })
        return undefined
    }

}
