import { IBlueprint } from '@sepraisal/common'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { IconButton } from '@material-ui/core'
import IconFavorite from '@material-ui/icons/Favorite'
import IconFavoriteBorder from '@material-ui/icons/FavoriteBorder'

import { createSmartFC, createStyles, IMyTheme } from '../common/'
import { CONTEXT } from '../stores'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },
})


interface IProps {
    id: number | undefined
}


export default hot(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {
    const {id} = props
    const blueprintStore = React.useContext(CONTEXT.BLUEPRINTS)

    // Don't favorite uploads - they are already in seperate list.
    if(!id) {
        return null
    }

    const favorited = blueprintStore.favorites.has(id)
    const handleToggle = () => {
        if(favorited) {
            blueprintStore.setRecent(blueprintStore.getSomething(id))
        } else {
            blueprintStore.setFavorite(blueprintStore.getSomething(id))
        }
    }

    return (
        <IconButton className={classes.root} size='small' color='secondary' aria-label='favorite' onClick={handleToggle}>
            {favorited ? <IconFavorite /> : <IconFavoriteBorder />}
        </IconButton>
    )
})) /* ============================================================================================================= */
