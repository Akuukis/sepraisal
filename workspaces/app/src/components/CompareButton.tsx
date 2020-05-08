import clsx from 'clsx'
import { action } from 'mobx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { IconButton, IconButtonProps } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import { CONTEXT } from 'src/stores'

import IconCompare from './icons/IconCompare'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    on: {
        color: theme.palette.success.main,
    },
    off: {
        color: theme.palette.text.secondary,
    },
})


interface IProps extends Omit<IconButtonProps, 'id'> {
    id: number | string
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {id, ...otherProps} = props
    const selectionStore = React.useContext(CONTEXT.SELECTION)

    const compared = selectionStore.selected.includes(id)
    const handleToggle = action(`CompareButton<${JSON.stringify(id)}>`, () => {
        if(compared) {
            selectionStore.selected.remove(id)
        } else {
            selectionStore.selected.push(id)
        }
    })

    return (
        <IconButton
            className={clsx(classes.root, compared ? classes.on : classes.off)}
            color='inherit'
            aria-label='compare'
            onClick={handleToggle}
            {...otherProps}
        >
            <IconCompare />
        </IconButton>
    )
})) /* ============================================================================================================= */
