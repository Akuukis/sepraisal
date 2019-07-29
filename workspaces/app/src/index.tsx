import './rhlConfig'

import { configure } from 'mobx'
import * as React from 'react'
import { render } from 'react-dom'

import routes from './routes'
import { CONTEXT } from './stores'
import RouterStore from './stores/RouterStore'

// enable MobX strict mode
configure({ enforceActions: 'always' })

// prepare MobX stores
const routerStore = new RouterStore()

render((
        <CONTEXT.ROUTER.Provider value={routerStore}>

        {routes}

        </CONTEXT.ROUTER.Provider>
    ),
    document.getElementById('root'),
)
