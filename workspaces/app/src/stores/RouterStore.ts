import { createHashHistory } from 'history'
import { RouterStore as BaseRouterStore, syncHistoryWithStore } from 'mobx-react-router'

import { ROUTES } from '../constants/routes'

export class RouterStore extends BaseRouterStore {
    public constructor() {
        super()
        this.history = syncHistoryWithStore(createHashHistory(), this)
    }

    public goBlueprint(id: number, revision?: number) {
        if(!revision) return this.push(`${ROUTES.BLUEPRINT}/${id}`)

        return this.push(`${ROUTES.BLUEPRINT}/${id}-${revision}`)
    }
}

export default RouterStore
