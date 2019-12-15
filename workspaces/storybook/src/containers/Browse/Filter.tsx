import Filters from '@sepraisal/app/lib/containers/Browse/Filters'
import { Card } from '@sepraisal/app/lib/models'
import { CardStore } from '@sepraisal/app/lib/stores/CardStore'
import { action as storyAction } from '@storybook/addon-actions'
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


class MockCardStore extends CardStore {
    public get find() {
        storyAction('find')()

        return super.find
    }

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

    public setFind(value: Parameters<CardStore['setFind']>[0]) {
        super.setFind(value)
        storyAction('setFind')(JSON.stringify(super.find), super.find)
    }
}

storiesOf('Containers|BrowseFilters', module)
    .addDecorator(Theme('my'))
    .addDecorator(ProviderDecorator({
        CARDS: new MockCardStore(),
    }))
    .addDecorator(withKnobs)
    .add('Default2', () => {
        const toggleDrawer = storyAction('toggleDrawer')

        return (
            <Filters toggleDrawer={toggleDrawer} />
        )
    })
