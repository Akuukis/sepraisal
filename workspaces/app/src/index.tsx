import './rhlConfig'

import { MATOMO_PARAMS } from '@sepraisal/common'
import { configure } from 'mobx'
import * as React from 'react'
import { render } from 'react-dom'

import routes from './routes'
import { CONTEXT } from './stores'
import { PiwikStore } from './stores/PiwikStore'
import RouterStore from './stores/RouterStore'

// enable MobX strict mode
configure({ enforceActions: 'always' })

// prepare MobX stores
const piwikStore = new PiwikStore(process.env.NODE_ENV === 'development' ? {} : MATOMO_PARAMS)
const routerStore = new RouterStore(piwikStore)

render((
        <CONTEXT.PIWIK.Provider value={piwikStore}>
        <CONTEXT.ROUTER.Provider value={routerStore}>

        {routes}

        </CONTEXT.ROUTER.Provider>
        </CONTEXT.PIWIK.Provider>
    ),
    document.getElementById('root'),
)
