import { createBrowserHistory } from 'history'
import { RouterStore as BaseRouterStore, syncHistoryWithStore } from 'mobx-react-router'

import { ROUTES } from '../constants/routes'
import { PiwikStore } from './PiwikStore'


export class RouterStore extends BaseRouterStore {
    private piwikStore: PiwikStore

    public constructor(piwikStore: PiwikStore) {
        super()
        this.piwikStore = piwikStore
        this.history = syncHistoryWithStore(createBrowserHistory(), this)
    }

    public goBlueprint(id: number) {
        const path = `${ROUTES.ANALYSE}?id=${id}`

        this.piwikStore.track({path})
        this.push(path)
    }

    public goView(path: string): void {
        this.piwikStore.track({path})
        this.push(path)
    }
}

export default RouterStore
