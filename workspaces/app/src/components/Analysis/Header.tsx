import { IBlueprint } from '@sepraisal/common'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'
import { Link } from 'react-router-dom'

import { AppBar, Avatar, Toolbar, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme, linkAuthorProps } from '../../common/'
import FavoriteButton from '../../components/FavoriteButton'
import { ROUTES } from '../../constants/routes'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        zIndex: theme.zIndex.appBar - 200,
    },

    header: {
        '&:visited': {
            color: theme.palette.secondary.main,
        },
        '&:link': {
            color: 'white',
        },
    },
    toolbar: {
        backgroundColor: theme.palette.success.main,
    }
})


interface IProps {
    bp: IBpProjectionRow
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {bp} = props

    const author = 'steam' in bp && bp.steam !== undefined
        ?
            (<a {...linkAuthorProps(bp.steam.author.id)}>
                {bp.steam.author.title?.slice(0, 2) ?? bp.steam.author.id}
            </a>)
        : '<>'

    const title = 'steam' in bp && bp.steam !== undefined
        ?
            (<Link className={classes.header} to={`${ROUTES.BLUEPRINT}/${bp._id!}`}>
                {bp.steam.title}
            </Link>)
        : bp.sbc.gridTitle
    return (
        <>
            <AppBar position='static' className={classes.root}>
                <Toolbar className={classes.toolbar}>
                    <Avatar style={{marginRight: '0.5em'}}>
                        {author}
                    </Avatar>
                    {/* <IconButton color='contrast' aria-label='Menu'>
                        <IconMoreVert />
                    </IconButton> */}
                    <Typography variant='h6' color='inherit' style={{flex: 1}}>
                        {title}
                    </Typography>
                    <FavoriteButton bpId={bp._id!} name={'steam' in bp && bp.steam !== undefined ? bp.steam.title : bp.sbc.gridTitle} />
                    {/* <IconButton color='inherit' aria-label='remove'>
                        <IconClose />
                    </IconButton> TODO: Add Close for Compare view. */}
                </Toolbar>
            </AppBar>
        </>
    )
})) /* ============================================================================================================= */


type ProjectionCardSteam =
    | 'id'
    | 'title'
    | 'description'
    | 'author'
    | 'collections'
    | 'subscriberCount'
    | 'visitorCount'
    | 'postedDate'
    | 'updatedDate'
    | 'commentCount'
    | 'popularity'

type ProjectionCardSbc =
    | 'gridTitle'

interface IBpProjectionRow {
    _id?: number
    sbc: {[key in keyof Pick<IBlueprint.ISbc, ProjectionCardSbc>]: IBlueprint.ISbc[key]}
    steam?: {[key in keyof Pick<IBlueprint.ISteam, ProjectionCardSteam>]: IBlueprint.ISteam[key]}
}
