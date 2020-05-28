import { History } from 'history'
import * as React from 'react'
import { Redirect, Route, Router, Switch } from 'react-router-dom'

import { ROUTE } from 'src/constants'

import App from './containers/App'
import Blog from './containers/Blog'
import Blueprint from './containers/Blueprint'
import Browse from './containers/Browse'
import Compare from './containers/Compare'
import Home from './containers/Home'
import Info from './containers/Info'


export default (history: History) => (
    <Router history={history}>
        <App>
            <Switch>
                <Route path={ROUTE.ANALYSE}>
                    <Blueprint />
                </Route>
                <Route path={ROUTE.BROWSE}>
                    <Browse />
                </Route>
                <Route path={ROUTE.COMPARE}>
                    <Compare />
                </Route>
                <Route path={ROUTE.BLOG}>
                    <Blog />
                </Route>
                <Route path={ROUTE.INFO}>
                    <Info />
                </Route>
                <Route path={ROUTE.HOME}>
                    <Home />
                </Route>
                <Redirect from='*' to={ROUTE.HOME} />
            </Switch>
        </App>
    </Router>
)
