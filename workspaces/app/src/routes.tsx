import { History } from 'history'
import * as React from 'react'
import { Redirect, Route, Router, Switch } from 'react-router-dom'

import { ROUTES } from 'src/constants/routes'

import App from './containers/App'
import Blueprint from './containers/Blueprint'
import Browse from './containers/Browse'
import Compare from './containers/Compare'
import Home from './containers/Home'
import Info from './containers/Info'


export default (history: History) => (
    <Router history={history}>
        <App>
            <Switch>
                <Route path={ROUTES.ANALYSE}>
                    <Blueprint />
                </Route>
                <Route path={ROUTES.BROWSE}>
                    <Browse />
                </Route>
                <Route path={ROUTES.COMPARE}>
                    <Compare />
                </Route>
                <Route path={ROUTES.INFO}>
                    <Info />
                </Route>
                <Route path={ROUTES.HOME}>
                    <Home />
                </Route>
                <Redirect from='*' to={ROUTES.HOME} />
            </Switch>
        </App>
    </Router>
)
