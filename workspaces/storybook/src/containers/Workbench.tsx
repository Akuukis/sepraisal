import Workbench from '@sepraisal/app/lib/containers/Workbench'
import { withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import * as React from 'react'

import Theme from '../ThemeDecorator'


storiesOf('Containers|Workbench', module)
    .addDecorator(Theme('my'))
    .addDecorator(withKnobs)
    .add('Default', () => {
        return <Workbench />
    })
