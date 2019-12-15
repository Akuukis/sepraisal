import { createSmartFC } from '@sepraisal/app/lib/common'
import SliderLog from '@sepraisal/app/lib/containers/Browse/Filters/FormControls/SliderLog'
import { CONTEXT } from '@sepraisal/app/lib/stores'
import { CardStore, PRESET } from '@sepraisal/app/lib/stores/CardStore'
import { action as storyAction } from '@storybook/addon-actions'
import { number, withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import { action } from 'mobx'
import * as React from 'react'

import { Button } from '@material-ui/core'

import { ProviderDecorator } from '../../ProviderDecorator'
import Theme from '../../ThemeDecorator'


class MockCardStore extends CardStore {
    protected _find = PRESET.none

    public get find() {
        storyAction('find')()

        return super.find
    }

    public setFind(value: Parameters<CardStore['setFind']>[0]) {
        super.setFind(value)
        storyAction('setFind')(JSON.stringify(super.find), super.find)
    }
}

storiesOf('Containers|SliderLog', module)
    .addDecorator(Theme('my'))
    .addDecorator(ProviderDecorator({
        CARDS: new MockCardStore(),
    }))
    .addDecorator(withKnobs)
    .add('Default2', () => {
        const Set = createSmartFC({})<{}>(({children, classes, theme, ...props}) => {
            const cardStore = React.useContext(CONTEXT.CARDS)

            const reset = action(() => {
                const value = {
                    'sbc.blockCount': {$gte: 25, $lte: 891}
                }
                const index = cardStore.find.$and.findIndex((obj) => Object.keys(obj).pop()! === 'sbc.blockCount')
                const before = cardStore.find.$and.slice(0, Math.max(0, index))
                const after = cardStore.find.$and.slice(index + 1, cardStore.find.$and.length)
                cardStore.setFind({$and: [
                    ...before,
                    value,
                    ...after,
                ]})
            })

            return (<Button variant='contained' onClick={reset}>
                    Reset
                </Button>)
        })

        const Peek = createSmartFC({})<{}>(({children, classes, theme, ...props}) => {
            const cardStore = React.useContext(CONTEXT.CARDS)
            const found = cardStore.find.$and.find((obj) => Object.keys(obj).pop()! === 'sbc.blockCount')

            return (<pre>
                    {!found ? '-' : JSON.stringify(found)}
                </pre>)
        })

        return (
            <div style={{padding: '20px'}}>
                <SliderLog
                    title='Block count'
                    findKey='sbc.blockCount'
                    min={0}
                    max={Math.pow(10, 5)}
                    zeroes={{$exists: false}}
                />
                <Set />
                <Peek />
            </div>
        )
    })
