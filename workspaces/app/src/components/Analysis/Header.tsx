import { IBlueprint } from '@sepraisal/common'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { AppBar, Toolbar, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../common/'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        zIndex: theme.zIndex.appBar - 200,
    },

    toolbar: {
        minHeight: 58,
        backgroundColor: theme.palette.success.main,
    }
})


interface IProps {
    title: React.ReactNode
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {title} = props

    return (
        <>
            <AppBar position='static' className={classes.root}>
                <Toolbar className={classes.toolbar}>
                    {/* <IconButton color='contrast' aria-label='Menu'>
                        <IconMoreVert />
                    </IconButton> */}
                    <Typography variant='h6' color='inherit' style={{flex: 1}}>
                        {title}
                    </Typography>
                    {children}
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
