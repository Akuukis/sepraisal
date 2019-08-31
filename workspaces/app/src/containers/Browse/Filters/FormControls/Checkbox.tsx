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


export default hot(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {
    const {title, findKey, yes, no} = props
    const cardStore = React.useContext(CONTEXT.CARDS)

    let checked: null | boolean
    // tslint:disable-next-line: no-non-null-assertion - TODO review.
    const index = cardStore.find.$and.findIndex((obj) => Object.keys(obj).pop()! === findKey)
    if(index === -1) {
        checked = null
    } else {
        const item = cardStore.find.$and[index]
        checked = JSON.stringify(item[findKey]) === JSON.stringify(yes)
    }
    const toggleChecked = action((_, value: boolean) => {
        if(checked === false) {
            cardStore.setFind({$and: [
                ...cardStore.find.$and.slice(0, index),
                ...cardStore.find.$and.slice(index + 1, cardStore.find.$and.length),
            ]})
        } else if(value) {
            cardStore.setFind({$and: [
                ...cardStore.find.$and,
                {[findKey]: yes},
            ]})
        } else {
            cardStore.setFind({$and: [
                ...cardStore.find.$and.slice(0, index),
                {[findKey]: no},
                ...cardStore.find.$and.slice(index + 1, cardStore.find.$and.length),
            ]})
        }
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
