import clsx from 'clsx'
import { runInAction } from 'mobx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { darken, IconButton, ListItem, ListItemSecondaryAction, ListItemText, TextField } from '@material-ui/core'
import IconDeleteForever from '@material-ui/icons/DeleteForever'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import FavoriteButton from 'src/components/FavoriteButton'
import IconEdit from 'src/components/icons/IconEdit'
import { CONTEXT } from 'src/stores'

const styles = (theme: IMyTheme) => createStyles({
    root: {
        margin: theme.spacing(1, 0),
        paddingRight: 76,  // Double secondary actions.
    },

    selected: {
        '&:hover': {
            background: darken(theme.palette.background.default, 0.1),
        },
        'background': theme.palette.background.default,
    },
    textField: {
        marginTop: 0,
        marginBottom: 0,
    },
    editIcon: {
        padding: theme.spacing(0, 1),
        verticalAlign: 'text-bottom',
    },
})


interface IProps {
    id: string
    title: string
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const blueprintStore = React.useContext(CONTEXT.BLUEPRINTS)
    const analyticsStore = React.useContext(CONTEXT.ANALYTICS)
    const selectionStore = React.useContext(CONTEXT.SELECTION)
    const [edit, setEdit] = React.useState<string | null>(null)

    const {id, title} = props
    const index = selectionStore.selected.indexOf(id)

    const handleToggle = () => {
        if(edit !== null) return  // Don't toggle while editing.

        if(index === -1) {
            runInAction(() => selectionStore.selected.push(id))
            analyticsStore.trackEvent(
                'workshop',
                id === title ? 'select-upload' : 'select-recent',
                id,
                undefined,
            )
        } else {
            analyticsStore.trackEvent(
                'workshop',
                id === title ? 'deselect-upload' : 'deselect-recent',
                id,
                undefined,
            )
            runInAction(() => selectionStore.selected.remove(id))
        }
    }
    const handleDelete = () => {
        analyticsStore.trackEvent(
            'workshop',
            id === title ? 'delete-upload' : 'delete-recent',
            id,
            undefined,
        )
        runInAction(() => {
            selectionStore.selected.remove(id)
            blueprintStore.deleteSomething(id)
        })
    }

    const startEdit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.stopPropagation()
        setEdit(title)
    }
    const handleEdit = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEdit(event.target.value)
    }
    const cancelEdit = () => {
        setEdit(null)
    }
    const checkEditDone = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Escape") return cancelEdit()
        if (event.key !== "Enter") return

        if(edit === null) throw new Error('catch me')  // Typeguarding.

        if(id !== edit) {
            const blueprint = blueprintStore.getSomething(id)
            runInAction(() => {
                blueprintStore.deleteUpload(id)
                selectionStore.selected.remove(id)

                blueprintStore.setUpload(blueprint, edit)
                selectionStore.selected.push(edit)
            })
        }

        setEdit(null)
    }

    const primary = edit === null ? (
            <>
                {title}
                <IconButton className={classes.editIcon} onClick={startEdit}>
                    <IconEdit />
                </IconButton>
            </>
        ) : (
            <>
                <TextField
                    className={classes.textField}
                    fullWidth
                    autoFocus
                    onBlur={cancelEdit}
                    value={edit}
                    onChange={handleEdit}
                    onKeyDown={checkEditDone}
                />
            </>
        )

    return (
        <ListItem
            button
            key={id}
            className={clsx(classes.root, index === -1 ? '' : classes.selected)}
            onClick={handleToggle}
        >
            <ListItemText
                primary={primary}
                primaryTypographyProps={{variant: 'body1'}}
            />
            <ListItemSecondaryAction>
                <IconButton onClick={handleDelete} ><IconDeleteForever /></IconButton>
                <FavoriteButton bpId={id} name={title} edge='end' />
            </ListItemSecondaryAction>
        </ListItem>
    )
})) /* ============================================================================================================= */
