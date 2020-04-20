import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Avatar, CardHeader } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../../common/'
import { CardStatus, ICard } from '../../../models/Card'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        minWidth: '0px',  // Shrink if name too long.
        paddingBottom: theme.spacing(2),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingTop: theme.spacing(2),
    },
})


interface IProps {
    id: number
    steam: ICard<CardStatus>['steam']
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {id, steam} = props

    const avatarTitle = steam?.author.title?.slice(0, 2) ?? '??'
    const title = steam?.title ?? String(id)
    const subheader = steam !== null
        ? (steam.collections.length > 0 ? steam.collections[0].title : '-')
        : 'Analysis in progress...'

    return (
        <CardHeader
            className={classes.root}
            titleTypographyProps={{noWrap: true, style: {lineHeight: '1.429em'}}}
            subheaderTypographyProps={{noWrap: true, style: {lineHeight: '1.429em'}}}
            avatar={<Avatar>{avatarTitle}</Avatar>}
            title={title}
            subheader={subheader}
        />
    )
})) /* ============================================================================================================= */
