import { action } from 'mobx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Checkbox, FormControlLabel } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../../../common/'
import { CONTEXT } from '../../../../stores'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    content: {
    },
    heading: {
        flexBasis: '33.33%',
        flexShrink: 0,
        fontSize: theme.typography.pxToRem(15),
    },
    secondaryHeading: {
        color: theme.palette.text.secondary,
        fontSize: theme.typography.pxToRem(15),
    },
})


interface IProps {
    findKey: string,
    no: unknown,
    title: string,
    yes: unknown,
}

const NEXT_STATE = new Map([
    // from -> to
    [null, true],
    [true, false],
    [false, null],
])

export default hot(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {
    const {title, findKey, yes, no} = props
    const piwikStore = React.useContext(CONTEXT.PIWIK)
    const cardStore = React.useContext(CONTEXT.CARDS)

    const values = new Map([
        [null, []],
        [true, [{[findKey]: yes}]],
        [false, [{[findKey]: no}]],
    ])

    let checked: null | boolean
    // tslint:disable-next-line: no-non-null-assertion - TODO review.
    const index = cardStore.find.$and.findIndex((obj) => Object.keys(obj).pop()! === findKey)
    if(index === -1) {
        checked = null
    } else {
        const item = cardStore.find.$and[index]
        checked = JSON.stringify(item[findKey]) === JSON.stringify(yes)
    }

    const toggleChecked = action(() => {
        piwikStore.push([
            'event',
            'custom-filter',
            findKey,
            // tslint:disable-next-line: no-non-null-assertion
            JSON.stringify(NEXT_STATE.get(checked)!),
        ])
        cardStore.setFind({$and: [
            ...cardStore.find.$and.slice(0, Math.max(0, index)),
            // tslint:disable-next-line: no-non-null-assertion
            ...values.get(NEXT_STATE.get(checked)!)!,
            ...cardStore.find.$and.slice(index + 1, cardStore.find.$and.length),
        ]})
    })

    return (
        <FormControlLabel
            control={
                <Checkbox
                    checked={checked === true}
                    onChange={toggleChecked}
                    value={findKey}
                    indeterminate={checked === null}
                />
            }
            label={title}
            style={checked === null ? {color: theme.palette.text.disabled} : {}}
        />
    )
})) /* ============================================================================================================= */
