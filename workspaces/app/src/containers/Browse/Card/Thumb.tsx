import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { CardMedia } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme, THUMB_HEIGHT, THUMB_WIDTH } from 'src/common'
import { CardStatus, ICard } from 'src/models/Card'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        paddingTop: `calc(${theme.shape.boxWidth}/${THUMB_WIDTH} * ${THUMB_HEIGHT}px)`,
    },
})


interface IProps {
    id: number
    thumb: ICard<CardStatus>['thumb']
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {id, thumb} = props

    const image = (thumb && thumb.webp)
        ? `data:image/webp;base64,${thumb.webp.toString('base64')}`
        : `//via.placeholder.com/${THUMB_WIDTH}x${THUMB_HEIGHT}?text=No+Image`


    return (
        <CardMedia
            className={classes.root}
            image={image}
            title={`Thumb for ${id}`}
        />
    )
})) /* ============================================================================================================= */
