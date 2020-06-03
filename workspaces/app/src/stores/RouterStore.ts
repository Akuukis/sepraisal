import { createBrowserHistory } from 'history'
import { RouterStore as BaseRouterStore, syncHistoryWithStore } from 'mobx-react-router'

import { ROUTE } from 'src/constants'

import { PiwikStore } from './PiwikStore'


export class RouterStore extends BaseRouterStore {
    private analyticsStore: PiwikStore

    public constructor(analyticsStore: PiwikStore) {
        super()
        this.analyticsStore = analyticsStore
        this.history = syncHistoryWithStore(createBrowserHistory(), this)
    }

    public goBlueprint(id: number) {
        const path = `${ROUTE.ANALYSE}?steam=${id}`

        this.analyticsStore.track({path})
        this.push(path)
    }

    public goView(path: string): void {
        this.analyticsStore.track({path})
        this.push(path)
    }
}

export default RouterStore
