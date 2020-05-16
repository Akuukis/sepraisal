import clsx from 'clsx'
import { runInAction } from 'mobx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { darken, ListItem, ListItemSecondaryAction, ListItemText } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import FavoriteButton from 'src/components/FavoriteButton'
import { CONTEXT } from 'src/stores'

import FromNow from './FromNow'

const styles = (theme: IMyTheme) => createStyles({
    root: {
        margin: theme.spacing(1, 0),
        paddingRight: 128,
    },

    listItemText: {
    },
    selected: {
        '&:hover': {
            background: darken(theme.palette.background.default, 0.1),
        },
        'background': theme.palette.background.default,
    },
})


interface IProps {
    id: string | number
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {id} = props
    const blueprintStore = React.useContext(CONTEXT.BLUEPRINTS)
    const piwikStore = React.useContext(CONTEXT.PIWIK)
    const selectionStore = React.useContext(CONTEXT.SELECTION)

    const blueprint = blueprintStore.getSomething(id)!
    const title = String(blueprint.steam?.title ?? id)
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
                primaryTypographyProps={{variant: 'body1'}}
            />
            <ListItemSecondaryAction>
                <FromNow variant='caption' moment={blueprint._cached} />
                <FavoriteButton bpId={id} name={title} edge='end' />
            </ListItemSecondaryAction>
        </ListItem>
    )
})) /* ============================================================================================================= */
