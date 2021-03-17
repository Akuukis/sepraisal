import { createBrowserHistory, LocationDescriptorObject } from 'history'
import { RouterStore as BaseRouterStore, syncHistoryWithStore } from 'mobx-react-router'

import { ROUTE } from 'src/constants'

import { AbstractAnalyticsStore } from './Analytics/AbstractAnalyticsStore'


export class RouterStore extends BaseRouterStore {
    private analyticsStore: AbstractAnalyticsStore

    public constructor(analyticsStore: AbstractAnalyticsStore) {
        super()
        this.analyticsStore = analyticsStore
        this.history = syncHistoryWithStore(createBrowserHistory(), this)
        this.history.listen((location, action) => {
            if(action === 'PUSH') {
                this.analyticsStore.trackView(location)
            }
        });
    }

    public pathToBlueprint(id: number): string {
        return `${ROUTE.ANALYSE}?steam=${id}`
    }

    public goBlueprint(id: number): void {
        const path = this.pathToBlueprint(id)

        this.push(path)
    }

    public goView(path: string): void {
        this.push(path)
    }

    public goLocation(location: LocationDescriptorObject): void {
        this.push(location)
    }
}

export default RouterStore
