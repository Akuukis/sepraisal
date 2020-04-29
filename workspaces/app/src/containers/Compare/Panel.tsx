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

    details: {
        borderColor: theme.palette.success.main,
    },
    list: {
        width: '100%',
        padding: theme.spacing(0),
    },
    secondaryHeading: {
        color: theme.palette.success.dark,
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
        details: classes.details,
        list: classes.list,
        secondaryHeading: classes.secondaryHeading,
    }

    return (
        <div className={classes.root}>
            <Grid container justify='flex-end'>
                <Grid item className={classes.switchItem}>
                    <Switch />
                    <Typography component='span' variant='subtitle2'>narrow columns</Typography>
                </Grid>
            </Grid>
            <PanelSelected elevation={0} classes={panelClasses} />
            <PanelFavorites elevation={0} classes={panelClasses} defaultExpanded />
            <PanelUploads elevation={0} classes={panelClasses} />
            <PanelRecent elevation={0} classes={panelClasses} />
        </div>
    )
})) /* ============================================================================================================= */
