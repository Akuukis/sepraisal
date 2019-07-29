import * as React from 'react'
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'

import { ROUTES } from './constants/routes'
import App from './containers/App'
import Blueprint from './containers/Blueprint'
import Browse from './containers/Browse'
import Credits from './containers/Credits'
import Home from './containers/Home'
import Workbench from './containers/Workbench'


export default (
    <HashRouter>
        <App>
            <Switch>
                <Route path={ROUTES.BLUEPRINT} component={Blueprint} />
                <Route path={ROUTES.BROWSE} component={Browse} />
                <Route path={ROUTES.WORKBENCH} component={Workbench} />
                <Route path={ROUTES.INFO} component={Credits} />
                <Route path={ROUTES.HOME} component={Home} />
                <Redirect from='*' to={ROUTES.HOME} />
            </Switch>
        </App>
    </HashRouter>
)
