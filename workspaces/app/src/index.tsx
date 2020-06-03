import './rhlConfig'

import { configure } from 'mobx'
import * as React from 'react'
import { render } from 'react-dom'

import { CONTEXT } from 'src/stores'
import { PiwikStore } from 'src/stores/PiwikStore'
import RouterStore from 'src/stores/RouterStore'

import { MATOMO_PARAMS } from './constants'
import routes from './routes'

// enable MobX strict mode
configure({ enforceActions: 'always' })

// prepare MobX stores
const analyticsStore = new PiwikStore(process.env.NODE_ENV === 'development' ? {} : MATOMO_PARAMS)
const routerStore = new RouterStore(analyticsStore)

render((
        <CONTEXT.ANALYTICS.Provider value={analyticsStore}>
        <CONTEXT.ROUTER.Provider value={routerStore}>

        {routes(routerStore.history)}

        </CONTEXT.ROUTER.Provider>
        </CONTEXT.ANALYTICS.Provider>
    ),
    document.getElementById('root'),
)
