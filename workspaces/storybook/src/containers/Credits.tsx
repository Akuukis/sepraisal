import Credits from '@sepraisal/app/lib/containers/Credits'
import { withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import * as React from 'react'

import Theme from '../ThemeDecorator'


storiesOf('Containers|Credits', module)
    .addDecorator(Theme('my'))
    .addDecorator(withKnobs)
    .add('Default', () => {
        return <Credits />
    })
