import { createBrowserHistory } from 'history'
import { RouterStore as BaseRouterStore, syncHistoryWithStore } from 'mobx-react-router'

import { ROUTE } from 'src/constants'

import { AbstractAnalyticsStore } from './Analytics/AbstractAnalyticsStore'


export class RouterStore extends BaseRouterStore {
    private analyticsStore: AbstractAnalyticsStore

    public constructor(analyticsStore: AbstractAnalyticsStore) {
        super()
        this.analyticsStore = analyticsStore
        this.history = syncHistoryWithStore(createBrowserHistory(), this)
    }

    public goBlueprint(id: number): void {
        const path = `${ROUTE.ANALYSE}?steam=${id}`

        this.analyticsStore.trackView({path})
        this.push(path)
    }

    public goView(path: string): void {
        this.analyticsStore.trackView({path})
        this.push(path)
    }
}

export default RouterStore
