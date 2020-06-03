import './rhlConfig'

import { configure } from 'mobx'
import * as React from 'react'
import { render } from 'react-dom'

import { CONTEXT } from 'src/stores'
import { SimpleAnalyticsStore } from 'src/stores/Analytics/SimpleAnalyticsStore'
import RouterStore from 'src/stores/RouterStore'

import { SIMPLE_ANALYTICS_PARAMS } from './constants'
import routes from './routes'

// enable MobX strict mode
configure({ enforceActions: 'always' })

// prepare MobX stores
const analyticsStore = new SimpleAnalyticsStore(process.env.NODE_ENV === 'development' ? {} : SIMPLE_ANALYTICS_PARAMS)
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
