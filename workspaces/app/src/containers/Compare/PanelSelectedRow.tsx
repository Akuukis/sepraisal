import clsx from 'clsx'
import { runInAction } from 'mobx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { IconButton, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText } from '@material-ui/core'
import IconClose from '@material-ui/icons/Close'
import IconDragHandle from '@material-ui/icons/DragHandle'

import { createSmartFC, createStyles, IMyTheme } from '../../common'
import { CONTEXT } from '../../stores'

const styles = (theme: IMyTheme) => createStyles({
    root: {},
    selected: {
        '&:hover': {
            background: theme.palette.secondary.light,
        },
        'background': theme.palette.secondary.light,
    },
})


interface IProps {
    id: string | number
    title: string
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const blueprintStore = React.useContext(CONTEXT.BLUEPRINTS)
    const piwikStore = React.useContext(CONTEXT.PIWIK)
    const selectionStore = React.useContext(CONTEXT.SELECTION)

    const {id, title} = props
    const index = selectionStore.selected.indexOf(id)

    const handleDeselect = () => {
        runInAction(() => {
            selectionStore.selected.remove(id)
        })
    }

    return (
        <ListItem
            button
            key={id}
            className={clsx(classes.root, index === -1 ? '' : classes.selected)}
        >
            <ListItemIcon>
                <IconDragHandle />
            </ListItemIcon>
            <ListItemText
                primary={title}
            />
            <ListItemSecondaryAction>
                <IconButton size='small' onClick={handleDeselect} ><IconClose /></IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    )
})) /* ============================================================================================================= */
