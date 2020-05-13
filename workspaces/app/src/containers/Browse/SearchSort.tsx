import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import IconSort from 'src/components/icons/IconSort'
import IconSortAscending from 'src/components/icons/IconSortAscending'
import IconSortDescending from 'src/components/icons/IconSortDescending'
import { CONTEXT } from 'src/stores'
import { CardStore } from 'src/stores/CardStore'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    button: {
    },
    text: {
        paddingLeft: theme.spacing(1),
    },
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

    const renderSortItem = (id: string) => {
        const title = TITLES[id]
        const {sort} = cardStore
        const icon =
            id in sort && sort[id] === -1 ? <ListItemIcon><IconSortDescending /></ListItemIcon> :
            id in sort && sort[id] ===  1 ? <ListItemIcon><IconSortAscending /></ListItemIcon> :
            null

        return (
            <MenuItem value={id} onClick={setSort}>
                {icon}
                <ListItemText inset={!icon} primary={title} />
            </MenuItem>
        )
    }

    const currentKey = Object.keys(cardStore.sort).pop()
    console.log(currentKey, {...cardStore.sort})
    const icon =
        currentKey === undefined ? <IconSort /> :
        cardStore.sort[currentKey] === -1 ? <IconSortDescending /> :
        cardStore.sort[currentKey] ===  1 ? <IconSortAscending /> :
        null

    return (
        <Grid className={classes.root} container alignItems='center' justify='center'>
            <Typography className={classes.text} variant='subtitle1'>
                {currentKey && TITLES[currentKey]}
            </Typography>
            <IconButton onClick={handleClick} className={classes.button}>
                {icon}
            </IconButton>
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
                {renderSortItem('steam.title')}
                {renderSortItem('steam.subscriberCount')}
                {renderSortItem('sbc.blockCount')}
                {renderSortItem('sbc.blockPCU')}
                {renderSortItem('sbc.oreVolume')}
            </Menu>
        </Grid>
    )
})) /* ============================================================================================================= */

const TITLES = {
    'steam.title': 'Blueprint Title',
    'steam.subscriberCount': 'Subscribers',
    'sbc.blockCount': 'Blocks',
    'sbc.blockPCU': 'PCU',
    'sbc.oreVolume': 'Ore, m\u00B3',
}
