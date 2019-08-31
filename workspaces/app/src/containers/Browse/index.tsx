import classNames from 'classnames'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Drawer, Grid, Paper } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../common/'
import Filters from './Filters'
import Pages from './Pages'
import Search from './Search'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        backgroundColor: '#FFF0',
        flexGrow: 1,
        height: `calc(100% - ${theme.spacing(2)}px)`,
        overflowY: 'scroll',
        padding: theme.spacing(1),
        transition: theme.transitions.create('margin', {
            duration: theme.transitions.duration.leavingScreen,
            easing: theme.transitions.easing.sharp,
        }),
    },

    drawer: {
        flexShrink: 0,
        width: drawerWidth,
    },
    drawerPaper: {
        height: 'calc(100% - 64px)',
        paddingTop: 64,
        width: drawerWidth,
        zIndex: 99,
    },
    rootShift: {
        marginRight: drawerWidth,
        transition: theme.transitions.create('margin', {
            duration: theme.transitions.duration.enteringScreen,
            easing: theme.transitions.easing.easeOut,
        }),
    },
})


interface IProps {
}


export default hot(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {
    const [open, setOpen] = React.useState(true)

    const toggleDrawer = () => setOpen(!open)

    return (
        <Paper className={classNames(classes.root, {[classes.rootShift]: open})}>
            <Drawer
                className={classes.drawer}
                variant='persistent'
                anchor='right'
                open={open}
                classes={{paper: classes.drawerPaper}}
            >
                <Filters
                    toggleDrawer={toggleDrawer}
                />
            </Drawer>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Search toggleDrawer={toggleDrawer} />
                </Grid>
            </Grid>
            <Pages />
        </Paper>
    )
})) /* ============================================================================================================= */


const drawerWidth = 360
