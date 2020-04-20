import Compare from 'workspaces/app/lib/containers/Compare'
import { withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import * as React from 'react'

import Theme from '../ThemeDecorator'
import { ProviderDecorator } from '../ProviderDecorator'
import { BlueprintStore } from '@sepraisal/app/lib/stores/BlueprintStore'
import { Aegir1 } from '../../blueprints/Aegir1'
import { Aegir2 } from '../../blueprints/Aegir2'
import { Aragath } from '../../blueprints/Aragath'
import { Wyvern } from '../../blueprints/Wyvern'


class MockBlueprintStore extends BlueprintStore {
    constructor() {
        super()
        this.setRecent(Aegir1)
        this.setRecent(Aegir2)
        this.setRecent(Aragath)
        this.setRecent(Wyvern)
    }
}

storiesOf('Containers|Compare', module)
    .addDecorator(Theme('my'))
    .addDecorator(withKnobs)
    .addDecorator(ProviderDecorator({
        BLUEPRINTS: new MockBlueprintStore(),
    }))
    .add('Default', () => {
        return <Compare />
    })
