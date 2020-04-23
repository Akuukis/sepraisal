import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Drawer, DrawerProps, GridProps, Toolbar } from '@material-ui/core'

import skyboxImage from '../../static/skybox.jpg'
import { createSmartFC, createStyles, IMyTheme } from '../common/'
import Topbar from '../components/Topbar'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        fontFamily: '"Roboto", Helvetica, Arial, sans-serif',
        fontSmoothing: 'antialiased',
        fontWeight: 300,
        height: '100%',
        minWidth: '230px',
        overflow: 'hidden',
        background: theme.palette.background.default,
        backgroundImage: `url(${skyboxImage})`,
    },

    asideWrapper: {
        width: drawerWidth,
    },

    aside: {
        zIndex: theme.zIndex.appBar - 1,
        width: drawerWidth,
        height: '100%',
    },

    asideContainer: {
        overflow: 'auto',
    },

    mainWrapper: {
        height: 'calc(100% - 56px)',
        [theme.breakpoints.up('xs')]: {
            height: 'calc(100% - 64px)',
        },
        overflowX: 'auto',
        marginLeft: drawerWidth,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },

    mainWrapperShifted: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: 0,
    },

    main: {
        minWidth: `calc(100% - ${theme.spacing(4)}px)`,
        minHeight: `calc(100% - ${theme.spacing(4)}px)`,
        padding: theme.spacing(2),
    },
})


interface IProps extends GridProps {
    aside?: React.ReactNode,
    asideProps?: DrawerProps,
    mainProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>,
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {aside, asideProps, mainProps, className, ...otherProps} = props

    return (
        <div className={classes.root} {...otherProps}>
            <Topbar />
            <Drawer
                className={classes.asideWrapper}
                variant='persistent'
                PaperProps={{component: 'aside', className: classes.aside}}
                {...asideProps}
            >
                <Toolbar />
                <div className={classes.asideContainer}>
                    {aside}
                </div>
            </Drawer>
            <Toolbar />
            <div className={clsx(classes.mainWrapper, {[classes.mainWrapperShifted]: !asideProps?.open})}>
                <main className={clsx(classes.main, className)} {...mainProps}>
                    {children}
                </main>
            </div>
        </div>
    )
})) /* ============================================================================================================= */

const drawerWidth = 360
