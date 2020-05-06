import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Drawer, DrawerProps, GridProps, IconButton, Toolbar, Typography } from '@material-ui/core'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'

import skyboxImage from '../../static/skybox.jpg'
import { createSmartFC, createStyles, dropShadowFromBoxShadow, IMyTheme } from '../common/'
import Topbar from '../components/Topbar'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        background: theme.palette.background.default,
        backgroundImage: `url(${skyboxImage})`,
        fontFamily: theme.typography.fontFamily,
        fontSize: theme.typography.fontSize,
        fontSmoothing: 'antialiased',
        fontWeight: 300,
        minHeight: '100vh',
        minWidth: 300,  // That's minium.
        overflow: 'hidden',
    },

    asideWrapper: {
        width: drawerWidth,
    },
    aside: {
        zIndex: theme.zIndex.appBar - 100,
        width: drawerWidth,
        backgroundColor: 'unset',
        borderRight: 0,
        filter: dropShadowFromBoxShadow(theme.shadows[16]),
        height: 'unset',
        maxHeight: `calc(100% - ${theme.spacing(6)}px)`,
    },
    asideHeader: {
        // <Toolbar variant='dense' />
        ...theme.mixins.toolbar,  // necessary for content to be below app bar
        minHeight: '48px',
        [theme.breakpoints.up('sm')]: {
            minHeight: '48px',
        },

        zIndex: 1,
        filter: dropShadowFromBoxShadow(theme.shadows[1]),
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        justifyContent: 'flex-end',
        backgroundColor: theme.palette.background.paper,
        borderRadius: `0 32px 0 0`,
        marginTop: theme.spacing(2),
    },
    asideHeaderTypography: {
        flexGrow: 1,
    },
    asideContainer: {
        overflowX: 'hidden',
        backgroundColor: theme.palette.background.paper,
        '&::after': {
            content: 'a'
        },
        borderRadius: `0 0 32px 0`,
    },
    aside2Wrapper: {
        width: buttonWidth,
    },
    aside2: {
        width: buttonWidth,
    },
    aside2Header: {
        borderRadius: `0 32px 32px 0`,
    },
    mainWrapper: {
        height: 'calc(100% - 48px)',  // Minus dense toolbar.
        [theme.breakpoints.up('sm')]: {
            height: 'calc(100% - 48px)',  // Minus dense toolbar.
        },
        overflowX: 'auto',
    },
    mainWrapperOpen: {
        paddingLeft: drawerWidth,
        transition: theme.transitions.create('padding-left', {
            delay: '200ms',
        }),
    },
    mainWrapperClosed: {
        transition: theme.transitions.create('padding-left', {
            delay: '200ms',
        }),
        paddingLeft: buttonWidth,
    },
    main: {
        minWidth: `calc(100% - ${theme.spacing(2)}px)`,
        minHeight: `calc(100% - ${theme.spacing(2)}px)`,
        padding: theme.spacing(1),
    },
})


interface IProps extends GridProps {
    aside?: React.ReactNode,
    asideTitle?: string,
    asideProps?: DrawerProps,
    mainProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>,
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {aside, asideProps, asideTitle, mainProps, className, ...otherProps} = props
    const [open, setOpen] = React.useState(!!aside)
    const toggleDrawer = () => setOpen(!open)

    return (
        <div className={classes.root} {...otherProps}>
            <Topbar />
            <Drawer
                hidden={!aside}
                className={clsx(classes.asideWrapper, classes.aside2Wrapper)}
                variant='permanent'
                PaperProps={{component: 'aside', className: clsx(classes.aside, classes.aside2)}}
                {...asideProps}
            >
                <Toolbar />
                <div className={clsx(classes.asideHeader, classes.aside2Header)}>
                    <IconButton onClick={toggleDrawer} color='primary'>
                        {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
            </Drawer>
            <Drawer
                className={classes.asideWrapper}
                variant='persistent'
                PaperProps={{component: 'aside', className: classes.aside}}
                open={open}
                {...asideProps}
            >
                <Toolbar />
                <div className={classes.asideHeader}>
                    <Typography className={classes.asideHeaderTypography} variant='h4' align='center'>{asideTitle}</Typography>
                    <IconButton onClick={toggleDrawer}>
                        {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
                <div className={classes.asideContainer}>
                    {aside}
                </div>
            </Drawer>
            <Toolbar />
            <div className={clsx(classes.mainWrapper, {
                    [classes.mainWrapperOpen]: !!aside && open,
                    [classes.mainWrapperClosed]: !!aside && !open,
                })}
            >
                <main className={clsx(classes.main, className)} {...mainProps}>
                    {children}
                </main>
            </div>
        </div>
    )
})) /* ============================================================================================================= */

const drawerWidth = 420
const buttonWidth = 40
