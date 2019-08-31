import App from '@sepraisal/app/lib/containers/App'
import Loading from '@sepraisal/app/lib/containers/App/Loading'
import { withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { Paper, Typography } from '@material-ui/core'

import Theme from '../ThemeDecorator'


storiesOf('Containers|App', module)
    .addDecorator(Theme('my'))
    .addDecorator(withKnobs)
    .add('Empty', () => (
        <App />
    ))
    .add('Loading', () => (
        <App>
            <Loading />
        </App>
    ))
    .add('Paper', () => (
        <App>
            <Paper>
                <Typography>Hello World</Typography>
            </Paper>
        </App>
    ))
