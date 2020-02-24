import { History, createHashHistory } from 'history'
import { RouterStore as BaseRouterStore, syncHistoryWithStore } from 'mobx-react-router'

import { ROUTES } from '../constants/routes'
import { PiwikStore } from './PiwikStore'

export class RouterStore extends BaseRouterStore {
    private piwikStore: PiwikStore

    public constructor(piwikStore: PiwikStore) {
        super()
        this.piwikStore = piwikStore
        this.history = syncHistoryWithStore(createHashHistory(), this)
    }

    public goBlueprint(id: number, revision?: number) {
        const path = `${ROUTES.BLUEPRINT}/${id}`

        this.piwikStore.track({path})
        this.push(revision === undefined ? path : `${path}-${revision}`)
    }

    public goView(path: string): void {
        this.piwikStore.track({path})
        this.push(path)
    }
}

export default RouterStore
