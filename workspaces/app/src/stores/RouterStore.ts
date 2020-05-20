import { createBrowserHistory } from 'history'
import { RouterStore as BaseRouterStore, syncHistoryWithStore } from 'mobx-react-router'

import { ROUTE } from 'src/constants'

import { PiwikStore } from './PiwikStore'


export class RouterStore extends BaseRouterStore {
    private piwikStore: PiwikStore

    public constructor(piwikStore: PiwikStore) {
        super()
        this.piwikStore = piwikStore
        this.history = syncHistoryWithStore(createBrowserHistory(), this)
    }

    public goBlueprint(id: number) {
        const path = `${ROUTE.ANALYSE}?steam=${id}`

        this.piwikStore.track({path})
        this.push(path)
    }

    public goView(path: string): void {
        this.piwikStore.track({path})
        this.push(path)
    }
}

export default RouterStore
