import * as React from 'react'
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'

import { ROUTES } from './constants/routes'
import App from './containers/App'
import Blueprint from './containers/Blueprint'
import Browse from './containers/Browse'
import Home from './containers/Home'
import Info from './containers/Info'
import Compare from './containers/Compare'


export default (
    <HashRouter>
        <App>
            <Switch>
                <Route path={ROUTES.BLUEPRINT} component={Blueprint} />
                <Route path={ROUTES.BROWSE} component={Browse} />
                <Route path={ROUTES.COMPARE} component={Compare} />
                <Route path={ROUTES.INFO} component={Info} />
                <Route path={ROUTES.HOME} component={Home} />
                <Redirect from='*' to={ROUTES.HOME} />
            </Switch>
        </App>
    </HashRouter>
)
