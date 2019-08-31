import { IObservableArray, runInAction } from 'mobx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { IconButton, ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core'
import IconDeleteForever from '@material-ui/icons/DeleteForever'

import { createSmartFC, createStyles, IMyTheme } from '../../common/'
import { CONTEXT } from '../../stores'

const styles = (theme: IMyTheme) => createStyles({
    root: {},
    selected: {
        '&:hover': {
            background: theme.palette.primary.main,
        },
        background: theme.palette.primary.main,
    },
})


interface IProps {
    id: string
    selected: IObservableArray<string>
    title: string
}


export default hot(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {
    const blueprintStore = React.useContext(CONTEXT.BLUEPRINTS)

    const {id, title, selected} = props
    const index = selected.indexOf(id)

    const handleToggle = () => {
        if(index === -1) {
            runInAction(() => selected.push(id))
        } else {
            runInAction(() => selected.remove(id))
        }
    }
    const handleDelete = () => {
        runInAction(() => {
            selected.remove(id)
            if(blueprintStore.uploads.has(id)) {
                blueprintStore.deleteUpload(id)
            }
            if(blueprintStore.recent.has(id)) {
                blueprintStore.deleteRecent(id)
            }
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
                <IconButton size='small' onClick={handleDelete} ><IconDeleteForever /></IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    )
})) /* ============================================================================================================= */
