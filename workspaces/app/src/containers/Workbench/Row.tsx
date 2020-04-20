import { IObservableArray, runInAction } from 'mobx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { IconButton, ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core'
import IconDeleteForever from '@material-ui/icons/DeleteForever'

import { createSmartFC, createStyles, IMyTheme } from '../../common/'
import { CONTEXT } from '../../stores'
import Favorite from '../../components/Favorite'

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


export default hot(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {
    const blueprintStore = React.useContext(CONTEXT.BLUEPRINTS)
    const piwikStore = React.useContext(CONTEXT.PIWIK)
    const selectionStore = React.useContext(CONTEXT.SELECTION)

    const {id, title} = props
    const index = selectionStore.selected.indexOf(id)

    const handleToggle = () => {
        if(index === -1) {
            runInAction(() => selectionStore.selected.push(id))
            piwikStore.push([
                'trackEvent',
                'workshop',
                id === title ? 'select-upload' : 'select-recent',
                id,
                undefined,
            ])
        } else {
            piwikStore.push([
                'trackEvent',
                'workshop',
                id === title ? 'deselect-upload' : 'deselect-recent',
                id,
                undefined,
            ])
            runInAction(() => selectionStore.selected.remove(id))
        }
    }
    const handleDelete = () => {
        piwikStore.push([
            'trackEvent',
            'workshop',
            id === title ? 'delete-upload' : 'delete-recent',
            id,
            undefined,
        ])
        runInAction(() => {
            selectionStore.selected.remove(id)
            blueprintStore.deleteSomething(id)
        })
    }

    return (
        <ListItem
            button
            key={id}
            className={index === -1 ? '' : classes.selected}
            onClick={handleToggle}
        >
            <ListItemText
                primary={title}
            />
            <ListItemSecondaryAction>
                <Favorite id={typeof id === 'number' ? id : undefined} />
                <IconButton size='small' onClick={handleDelete} ><IconDeleteForever /></IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    )
})) /* ============================================================================================================= */
