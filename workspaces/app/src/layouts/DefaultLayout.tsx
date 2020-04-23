import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Divider, Drawer, DrawerProps, GridProps, IconButton, Toolbar, Typography } from '@material-ui/core'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'

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
    },
    asideContainer: {
        overflow: 'auto',
    },
    asideHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,  // necessary for content to be below app bar
        justifyContent: 'flex-end',
    },
    asideHeaderTypography: {
        flexGrow: 1,
    },
    aside2Wrapper: {
        width: buttonWidth,
    },
    aside2: {
        zIndex: theme.zIndex.appBar - 2,
        width: buttonWidth,
        height: 'unset',
        backgroundColor: '#0000',
    },
    aside2IconButton: {
        backgroundColor: theme.palette.background.paper,
        borderRadius: '0 33% 33% 0',
    },
    mainWrapper: {
        height: 'calc(100% - 56px)',
        [theme.breakpoints.up('xs')]: {
            height: 'calc(100% - 64px)',
        },
        overflowX: 'auto',
    },
    mainWrapperOpen: {
        marginLeft: drawerWidth,
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    mainWrapperClosed: {
        transition: theme.transitions.create('margin', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        marginLeft: 0,
        paddingLeft: buttonWidth,
    },
    main: {
        minWidth: `calc(100% - ${theme.spacing(4)}px)`,
        minHeight: `calc(100% - ${theme.spacing(4)}px)`,
        padding: theme.spacing(2),
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
                <Divider />
                <div className={classes.asideContainer}>
                    {aside}
                </div>
            </Drawer>
            <Drawer
                hidden={!aside}
                className={classes.aside2Wrapper}
                variant='permanent'
                PaperProps={{component: 'aside', className: classes.aside2}}
                {...asideProps}
            >
                <Toolbar />
                <div className={classes.asideHeader}>
                    <IconButton onClick={toggleDrawer} color='primary' className={classes.aside2IconButton}>
                        {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
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

const drawerWidth = 360
const buttonWidth = 40
