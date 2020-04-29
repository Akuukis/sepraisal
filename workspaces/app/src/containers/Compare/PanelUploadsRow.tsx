import clsx from 'clsx'
import { runInAction } from 'mobx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { IconButton, ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core'
import IconDeleteForever from '@material-ui/icons/DeleteForever'

import { createSmartFC, createStyles, IMyTheme } from '../../common'
import FavoriteButton from '../../components/FavoriteButton'
import { CONTEXT } from '../../stores'

const styles = (theme: IMyTheme) => createStyles({
    root: {
        margin: theme.spacing(1, 0),
    },
    selected: {
        '&:hover': {
            background: `${theme.palette.background.default}CC`,
        },
        'background': theme.palette.background.default,
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
            className={clsx(classes.root, index === -1 ? '' : classes.selected)}
            onClick={handleToggle}
        >
            <ListItemText
                primary={title}
            />
            <ListItemSecondaryAction>
                <FavoriteButton id={id} name={title} />
                <IconButton onClick={handleDelete} edge='end'><IconDeleteForever /></IconButton>
            </ListItemSecondaryAction>
        </ListItem>
    )
})) /* ============================================================================================================= */
