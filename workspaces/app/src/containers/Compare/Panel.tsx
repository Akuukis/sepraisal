import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid, Switch, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../common'
import PanelFavorites from './PanelFavorites'
import PanelRecent from './PanelRecent'
import PanelSelected from './PanelSelected'
import PanelUploads from './PanelUploads'

const styles = (theme: IMyTheme) => createStyles({
    root: {
        position: 'relative',
        padding: theme.spacing(0, 0),
    },

    list: {
        width: '100%',
        padding: theme.spacing(0),
    },
    subpanel: {
    },
    switchItem: {
        paddingRight: theme.spacing(2),
    }
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const panelClasses = {
        root: classes.subpanel,
        list: classes.list,
    }

    return (
        <div className={classes.root}>
            <Grid container justify='flex-end'>
                <Grid item className={classes.switchItem}>
                    <Switch />
                    <Typography component='span' variant='subtitle2'>narrow columns</Typography>
                </Grid>
            </Grid>
            <PanelSelected classes={panelClasses} />
            <PanelFavorites classes={panelClasses} defaultExpanded />
            <PanelUploads classes={panelClasses} />
            <PanelRecent classes={panelClasses} />
        </div>
    )
})) /* ============================================================================================================= */
