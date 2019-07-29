import Column from '@sepraisal/app/lib/containers/Blueprint/Column'
import { withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { Aegir1 } from '../../../blueprints/Aegir1'
import { Aegir2 } from '../../../blueprints/Aegir2'
import { Aragath } from '../../../blueprints/Aragath'
import { Wyvern } from '../../../blueprints/Wyvern'
import { GridDecorator } from '../../GridDecorator'
import Theme from '../../ThemeDecorator'


storiesOf('Analysis|By Blueprints', module)
    .addDecorator(Theme('my'))
    .addDecorator(withKnobs)
    .addDecorator(GridDecorator())
    .add('Wyvern', () => (<Column width={12} bp={Wyvern} />))
    .add('Aegir1', () => (<Column width={12} bp={Aegir1} />))
    .add('Aegir2', () => (<Column width={12} bp={Aegir2} />))
    .add('Aragath', () => (<Column width={12} bp={Aragath} />))
