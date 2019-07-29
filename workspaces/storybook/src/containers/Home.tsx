import Home from '@sepraisal/app/lib/containers/Home'
import { withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import * as React from 'react'

import Theme from '../ThemeDecorator'


storiesOf('Containers|Home', module)
    .addDecorator(Theme('my'))
    .addDecorator(withKnobs)
    .add('Default', () => {
        return <Home />
    })
