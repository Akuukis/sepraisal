import { IBlueprint } from '@sepraisal/common'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { AppBar, Avatar, Toolbar, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme, linkAuthor, linkBp } from '../../common/'
import FavoriteButton from '../../components/FavoriteButton'
import MySection from '../MySection'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        width: '100%',
    },
    header: {
        '&:visited': {
            color: theme.palette.secondary.main,
        },
        '&:link': {
            color: 'white',
        },
    }
})


interface IProps {
    bp: IBpProjectionRow
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {bp} = props

    const author = 'steam' in bp && bp.steam !== undefined
        ?
            (<a href={linkAuthor(bp.steam.author.id)} target='_blank' rel='noreferrer noopener'>
                {bp.steam.author.title?.slice(0, 2) ?? bp.steam.author.id}
            </a>)
        : '<>'

    const title = 'steam' in bp && bp.steam !== undefined
        ?
            (<a href={linkBp(bp.steam.id)} className={classes.header} target='_blank' rel='noreferrer noopener'>
                {bp.steam.title}
            </a>)
        : bp.sbc.gridTitle
    return (
        <MySection className={classes.root}>
            <AppBar position='static'>
                <Toolbar>
                    <Avatar style={{marginRight: '0.5em'}}>
                        {author}
                    </Avatar>
                    {/* <IconButton color='contrast' aria-label='Menu'>
                        <IconMoreVert />
                    </IconButton> */}
                    <Typography variant='h6' color='inherit' style={{flex: 1}}>
                        {title}
                    </Typography>
                    <FavoriteButton id={bp._id} />
                    {/* <IconButton color='inherit' aria-label='remove'>
                        <IconClose />
                    </IconButton> TODO: Add Close for Compare view. */}
                </Toolbar>
            </AppBar>
        </MySection>
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
