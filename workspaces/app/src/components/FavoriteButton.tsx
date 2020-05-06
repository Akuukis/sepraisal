import clsx from 'clsx'
import { action } from 'mobx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { IconButton, IconButtonProps } from '@material-ui/core'
import IconFavorite from '@material-ui/icons/Favorite'
import IconFavoriteBorder from '@material-ui/icons/FavoriteBorder'

import { createSmartFC, createStyles, IMyTheme } from '../common/'
import { CONTEXT } from '../stores'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        color: theme.palette.error.main,
    },

    on: {
    },
    off: {
    },
})


interface IProps extends IconButtonProps {
    bpId: number | string
    name: string
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {bpId: id, name, className, ...otherProps} = props
    const favoriteStore = React.useContext(CONTEXT.FAVORITES)

    // Don't favorite uploads - they are already in seperate list.
    if(!id) {
        return null
    }

    const compared = favoriteStore.has(id)
    const handleToggle = action(`FavoriteButton<${JSON.stringify(id)}>`, () => {
        if(compared) {
            favoriteStore.shift(id)
        } else {
            favoriteStore.push({id, name})
        }
    })

    return (
        <IconButton
            className={clsx(classes.root, compared ? classes.on : classes.off)}
            color='inherit'
            aria-label='favorite'
            onClick={handleToggle}
            {...otherProps}
        >
            {compared ? <IconFavorite /> : <IconFavoriteBorder />}
        </IconButton>
    )
})) /* ============================================================================================================= */
