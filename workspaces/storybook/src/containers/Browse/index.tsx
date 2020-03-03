import Browse from '@sepraisal/app/lib/containers/Browse'
import { Card } from '@sepraisal/app/lib/models'
import { CardStore } from '@sepraisal/app/lib/stores/CardStore'
import { withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import { action, runInAction } from 'mobx'
import * as React from 'react'

import { Aegir1 } from '../../../blueprints/Aegir1'
import { Aegir2 } from '../../../blueprints/Aegir2'
import { Aragath } from '../../../blueprints/Aragath'
import { Wyvern } from '../../../blueprints/Wyvern'
import { ProviderDecorator } from '../../ProviderDecorator'
import Theme from '../../ThemeDecorator'
import { PiwikStore } from '@sepraisal/app/lib/stores/PiwikStore'


class MockCardStore extends CardStore {
    @action public async querry(pageNo: number = 0) {
        const docs = [
            Aegir1,
            Aegir2,
            Aragath,
            Wyvern,
        ]

        runInAction(() => {
            this.cards.replace(docs.map((doc) => [doc._id, new Card(doc)]))
        })
    }

}

storiesOf('Containers|Browse', module)
    .addDecorator(Theme('my'))
    .addDecorator(ProviderDecorator({
        CARDS: new MockCardStore({} as PiwikStore),
    }))
    .addDecorator(withKnobs)
    .add('Default', () =>
        <Browse />)
