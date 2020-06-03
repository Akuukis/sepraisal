import { AbstractAnalyticsStore, IAnalyticsStoreOpts } from './AbstractAnalyticsStore'


declare interface IWindowWithSimpleAnalytics extends Window {
    sa_event: {
        (eventName: string): void
        q: unknown[][]
    }
}
declare var window: IWindowWithSimpleAnalytics & typeof globalThis

const simpleAnalyticsAlreadyInitialized = () => {
    return typeof window.sa_event === 'undefined' || typeof window.sa_event !== 'function'
}


interface ISimpleAnalyticsStoreOpts extends IAnalyticsStoreOpts {
}

export class SimpleAnalyticsStore extends AbstractAnalyticsStore {

    public constructor(rawOpts: ISimpleAnalyticsStoreOpts = {}) {
        super(rawOpts)

        if (this._isShim) {
            window.sa_event = function (eventName: string) {
                console.info(`SimpleAnalyticsStore.push():`, ...eventName)
            } as any

            return
        }

        if (!simpleAnalyticsAlreadyInitialized()) {
            // Adapted from https://docs.simpleanalytics.com/events.
            window.sa_event = window.sa_event || function() {
                if(!window.sa_event.q) window.sa_event.q = []
                window.sa_event.q.push([].slice.call(arguments))
            }

            const firstScript = document.getElementsByTagName('script')[0]
            const element = document.createElement('script')
            element.type = 'text/javascript'
            element.defer = true
            element.async = true
            element.src = `https://${this.url}/latest.js`
            // tslint:disable-next-line: no-useless-cast no-non-null-assertion
            firstScript.parentNode!.insertBefore(element, firstScript)
        }

    }

    protected push([type, ...opts]: ['trackPageView' | 'trackEvent' | 'trackSiteSearch', string?, string?, (string | number)?, (string | number)?]) {
        switch(type) {
            case('trackPageView'): return  // Do nothing here, History is already watched automatically.
            case('trackEvent'): return window.sa_event(opts.slice(3).join('__'))
            case('trackSiteSearch'): return window.sa_event(['SiteSearch', ...opts].slice(2).join('__'))
            default: throw new Error(`SimpleAnalyticsStore: unknown type "${type}"`)
        }
    }

}
