import { AbstractAnalyticsStore, IAnalyticsStoreOpts } from './AbstractAnalyticsStore'


declare interface IWindowWithSimpleAnalytics extends Window {
    sa_event: {
        (eventName: string): void
        q: unknown[][]
    }
}
declare let window: IWindowWithSimpleAnalytics & typeof globalThis

const simpleAnalyticsAlreadyInitialized = () => {
    return typeof window.sa_event === 'function'
}


interface ISimpleAnalyticsStoreOpts extends IAnalyticsStoreOpts {
}

export class SimpleAnalyticsStore extends AbstractAnalyticsStore {

    public constructor(rawOpts: ISimpleAnalyticsStoreOpts = {}) {
        super(rawOpts)

        if (this._isShim) {
            window.sa_event = function (eventName: string) {
                console.debug(`SimpleAnalyticsStore.push():`, eventName)
            } as never

            const trackViewHandler = this.trackView.bind(this)
            // Listen to History.pushState
            // The same behavior as with normal SimpleAnalytics - https://github.com/simpleanalytics/scripts/blob/4ad5c1b6cb4c42ae2e483dc43a578e25399d53a4/src/default.js#L120-L137.
            if (Event && window.dispatchEvent && window.history ? window.history.pushState : null) {
                const stateListener = (type: string) => {
                    const orig = window.history[type]
                    return function(this: History, ...args) {
                        const rv = orig.apply(this, args)
                        trackViewHandler(window.location)
                        return rv
                    }
                }
                window.history.pushState = stateListener('pushState')
                window.addEventListener('pushState', () => {
                    trackViewHandler(window.location)
                })
            }

            return
        }

        if (!simpleAnalyticsAlreadyInitialized()) {
            // Adapted from https://docs.simpleanalytics.com/events.
            window.sa_event = window.sa_event || function(...args) {
                if(!window.sa_event.q) window.sa_event.q = []
                window.sa_event.q.push([].slice.call(args))
            }

            const firstScript = document.getElementsByTagName('script')[0]
            const element = document.createElement('script')
            element.type = 'text/javascript'
            element.defer = true
            element.async = true
            element.setAttribute('data-skip-dnt', 'true')  // Because SA doesn't track visitors to begin with.
            element.src = `https://${this.url}/latest.js`
            firstScript.parentNode?.insertBefore(element, firstScript)
        }
    }

    protected push([type, ...opts]: ['trackPageView' | 'trackEvent' | 'trackSiteSearch', string?, string?, (string | number)?, (string | number)?]): void {
        switch(type) {
            case('trackPageView'): {
                if(this._isShim) console.debug(`SimpleAnalyticsStore.trackView()`)
                // Do nothing here, History is already watched automatically.
                return
            }
            case('trackEvent'): {
                return window.sa_event(opts.slice(0, 2).join('__'))
            }
            case('trackSiteSearch'): return window.sa_event(['SiteSearch', ...opts].slice(0, 2).join('__'))
            default: throw new Error(`SimpleAnalyticsStore: unknown type "${type}"`)
        }
    }

}
