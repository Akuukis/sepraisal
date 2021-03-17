import './rhlConfig'

import { configure } from 'mobx'
import * as React from 'react'
import { render } from 'react-dom'

import { CONTEXT } from 'src/stores'
import RouterStore from 'src/stores/RouterStore'

import { GOAT_COUNTER_PARAMS } from './constants'
import routes from './routes'
import { GoatCounterStore } from './stores/Analytics/GoatCounterStore'


// enable MobX strict mode
configure({ enforceActions: 'always' })

// prepare MobX stores
const analyticsStore = new GoatCounterStore(process.env.NODE_ENV === 'development' ? {} : GOAT_COUNTER_PARAMS)
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
