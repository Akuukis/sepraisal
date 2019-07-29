import { IBlueprint } from '@sepraisal/common'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { AppBar, Avatar, Grid, IconButton, Toolbar, Typography } from '@material-ui/core'
import IconMoreVert from '@material-ui/icons/MoreVert'

import { createSmartFC, createStyles, GridSize, IMyTheme } from '../../common/'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },
})


interface IProps {
    bp: IBpProjectionRow
    width: GridSize
}


export default hot(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {
    const {bp} = props

    const author = 'steam' in bp && bp.steam !== undefined
        ? bp.steam.author.title.slice(0, 2)
        : '<>'

    const title = 'steam' in bp && bp.steam !== undefined
        ? bp.steam.title
        : bp.sbc.gridTitle

    return (
        <Grid item xs={props.width} className={classes.root}>
            <AppBar position='static' color='secondary'>
                <Toolbar>
                    <Avatar style={{marginRight: '0.5em'}}>
                        {author}
                    </Avatar>
                    {/* <IconButton color='contrast' aria-label='Menu'>
                    <IconMenu />
                    </IconButton> */}
                    <Typography variant='h6' color='inherit' style={{flex: 1}}>
                        {title}
                    </Typography>
                    <IconButton color='secondary' aria-label='remove'>
                        <IconMoreVert />
                    </IconButton>
                </Toolbar>
            </AppBar>
        </Grid>
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
    steam?: {[key in keyof Pick<IBlueprint.ISteam, ProjectionCardSteam>]: IBlueprint.ISteam[key]}
    sbc: {[key in keyof Pick<IBlueprint.ISbc, ProjectionCardSbc>]: IBlueprint.ISbc[key]}
}
