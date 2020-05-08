import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import {
    Grid,
    IconButton,
    InputAdornment,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    TextField,
} from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import IconBrowse from 'src/components/icons/IconBrowse'
import IconSort from 'src/components/icons/IconSort'
import IconSortAscending from 'src/components/icons/IconSortAscending'
import IconSortDescending from 'src/components/icons/IconSortDescending'

import { CONTEXT } from '../../stores'
import { CardStore } from '../../stores/CardStore'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    input: {
        backgroundColor: 'white',
    }
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const cardStore = React.useContext(CONTEXT.CARDS)
    const [anchor, setAnchor] = React.useState<HTMLElement | null>(null)

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchor(event.currentTarget)
    }
    const handleClose = () => {
        setAnchor(null)
    }
    const setSort = (event: React.MouseEvent<HTMLElement>) => {
        const key = event.currentTarget.getAttribute('value') as string
        const sort = cardStore.sort

        if(!(key in sort)) {
            cardStore.sort = {[key]: CardStore.defaultSortOrder}
        } else {
            if(cardStore.sort[key] === CardStore.defaultSortOrder) {
                cardStore.sort = {[key]: -CardStore.defaultSortOrder as 1 | -1}
            } else {
                cardStore.sort = {}
            }
        }

        cardStore.querry().catch((err) => console.error(err))
        handleClose()
    }


    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const $search = event.target.value
        cardStore.setFind({$text: {$search}})
    }

    const keyPress = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if(event.key !== 'Enter') return

        event.preventDefault()
        try {
            await cardStore.querry()
        } catch(err) {
            console.error(err)
        }
    }


    const renderSortItem = (id: string, title: string) => {
        const {sort} = cardStore
        const icon =
            id in sort && sort[id] === -1 ? <ListItemIcon><IconSortDescending /></ListItemIcon> :
            id in sort && sort[id] ===  1 ? <ListItemIcon><IconSortAscending /></ListItemIcon> :
            null

        return (
            <MenuItem value={id} onClick={setSort}>
                {icon}
                <ListItemText inset primary={title} />
            </MenuItem>
        )
    }

    const renderSortIcon = () => {
        const icon = <IconSort />
            // browser.sort.key === null ? SortIcon :
            // browser.sort.order === -1 ? SortDescendingIcon :
            // browser.sort.order ===  1 ? SortAscendingIcon :
            // undefined

        return (
            <IconButton onClick={handleClick}>
                {icon}
            </IconButton>
        )
    }

    return (
        <Grid item xs={12}>
            <TextField
                id='search'
                placeholder='Search by id, title, author, collection, or any keyword in description...'
                variant='outlined'
                value={cardStore.find.$text?.$search}
                onChange={handleChange}
                onKeyDown={keyPress}
                fullWidth
                InputProps={{
                    classes: {
                        root: classes.input,
                    },
                    endAdornment: [(
                        <InputAdornment position='end' key='sort'>
                            {renderSortIcon()}
                        </InputAdornment>
                    )],
                    fullWidth: false,
                    startAdornment: (
                        <InputAdornment position='start'>
                            <IconBrowse />
                        </InputAdornment>
                    ),
                }}
            />
            <Menu
                id='simple-menu'
                anchorEl={anchor}
                open={anchor !== null}
                onClose={handleClose}
                transitionDuration={100}
                getContentAnchorEl={null}
                anchorOrigin={{vertical: 'bottom', horizontal: 'left'}}
                transformOrigin={{vertical: 'top', horizontal: 'right'}}
            >
                {renderSortItem('title', 'Blueprint Title')}
                {renderSortItem('subscriberCount', 'Subscribers')}
                {renderSortItem('blockCount', 'Blocks')}
                {renderSortItem('blockPCU', 'PCU')}
                {renderSortItem('oreVolume', 'Ore, m\u00B3')}
            </Menu>
        </Grid>
    )
})) /* ============================================================================================================= */
