import clsx from 'clsx'
import { runInAction } from 'mobx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { fade, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'

import FavoriteButton from '../../components/FavoriteButton'
import IconDragHandle from '../../components/icons/IconDragHandle'
import { CONTEXT } from '../../stores'

const styles = (theme: IMyTheme) => createStyles({
    root: {
        margin: theme.spacing(1, 0),
    },
    selected: {
        '&:hover': {
            background: fade(theme.palette.background.default, 0.8),
        },
        'background': theme.palette.background.default,
    },
    handle: {
    },
})


interface IProps {
    id: string | number
    name: string
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {id, name} = props

    const piwikStore = React.useContext(CONTEXT.PIWIK)
    const selectionStore = React.useContext(CONTEXT.SELECTION)

    const index = selectionStore.selected.indexOf(id)

    const handleToggle = () => {
        if(index === -1) {
            runInAction(() => selectionStore.selected.push(id))
            piwikStore.push([
                'trackEvent',
                'workshop',
                id === name ? 'select-upload' : 'select-recent',
                id,
                undefined,
            ])
        } else {
            piwikStore.push([
                'trackEvent',
                'workshop',
                id === name ? 'deselect-upload' : 'deselect-recent',
                id,
                undefined,
            ])
            runInAction(() => selectionStore.selected.remove(id))
        }
    }

    return (
        <ListItem
            button
            key={id}
            className={clsx(classes.root, index === -1 ? '' : classes.selected)}
            onClick={handleToggle}
        >
            <ListItemIcon className={classes.handle}>
                <IconDragHandle />
            </ListItemIcon>
            <ListItemText
                primary={name}
            />
            <ListItemSecondaryAction>
                <FavoriteButton bpId={id} name={name} edge='end' />
            </ListItemSecondaryAction>
        </ListItem>
    )
})) /* ============================================================================================================= */
