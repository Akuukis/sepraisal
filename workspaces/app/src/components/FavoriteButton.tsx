import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { IconButton } from '@material-ui/core'
import IconFavorite from '@material-ui/icons/Favorite'
import IconFavoriteBorder from '@material-ui/icons/FavoriteBorder'

import { createSmartFC, createStyles, IMyTheme } from '../common/'
import { CONTEXT } from '../stores'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        color: theme.palette.error.main,
    },
})


interface IProps {
    id: number | string
    name: string
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {id, name} = props
    const favoriteStore = React.useContext(CONTEXT.FAVORITES)

    // Don't favorite uploads - they are already in seperate list.
    if(!id) {
        return null
    }

    const favorited = favoriteStore.has(id)
    const handleToggle = () => {
        if(favorited) {
            favoriteStore.shift(id)
        } else {
            favoriteStore.push({id, name})
        }
    }

    return (
        <IconButton className={classes.root} size='small' color='inherit' aria-label='favorite' onClick={handleToggle}>
            {favorited ? <IconFavorite /> : <IconFavoriteBorder />}
        </IconButton>
    )
})) /* ============================================================================================================= */
