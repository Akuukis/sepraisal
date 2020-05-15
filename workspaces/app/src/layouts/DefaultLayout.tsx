import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import {
    Dialog,
    Drawer,
    DrawerProps,
    Fab,
    GridProps,
    Hidden,
    IconButton,
    Toolbar,
    Typography,
    useMediaQuery,
} from '@material-ui/core'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'

import { createSmartFC, createStyles, dropShadowFromBoxShadow, IMyTheme } from 'src/common'
import Topbar from 'src/components/Topbar'

import skyboxImage from '../../static/skybox.jpg'


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
        maxWidth: drawerWidth,
        width: `calc(100% - ${theme.spacing(2)}px)`,
    },
    aside: {
        zIndex: theme.zIndex.appBar - 100,
        maxWidth: drawerWidth,
        width: `calc(100% - ${theme.spacing(2)}px)`,
        backgroundColor: 'unset',
        border: 0,
        filter: dropShadowFromBoxShadow(theme.shadows[16]),
        height: 'unset',
        maxHeight: `calc(100% - ${theme.spacing(6)}px)`,
    },
    asideHeader: {
        // <Toolbar variant='dense' />
        // ...theme.mixins.toolbar,  // necessary for content to be below app bar
        minHeight: '48px',
        [theme.breakpoints.up('sm')]: {
            minHeight: '48px',
            borderRadius: theme.direction === 'ltr' ? `32px 0 0 0` : `0 32px 0 0`,
            marginTop: theme.spacing(2),
        },

        zIndex: 1,
        filter: dropShadowFromBoxShadow(theme.shadows[1]),
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        justifyContent: 'flex-end',
        backgroundColor: theme.palette.background.paper,
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
        borderRadius: theme.direction === 'ltr' ? `0 0 0 32px` : `0 0 32px 0`,
    },
    aside2Wrapper: {
        width: buttonWidth,
    },
    aside2: {
        width: buttonWidth,
    },
    aside2Header: {
        borderRadius: theme.direction === 'ltr' ? `32px 0 0 32px` : `0 32px 32px 0`,
    },
    mainWrapper: {
        height: 'calc(100% - 48px)',  // Minus dense toolbar.
        [theme.breakpoints.up('sm')]: {
            height: 'calc(100% - 48px)',  // Minus dense toolbar.
        },
        overflowX: 'auto',
    },
    main: {
        minWidth: '100%',
        minHeight: '100%',
        boxSizing: 'border-box',
        padding: theme.spacing(1),
    },
    fab: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
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
    const toggleDrawer = (event: React.KeyboardEvent | React.MouseEvent) => {
        console.log('asdf')
        setOpen(!open)
    }
    const xsDown = useMediaQuery(theme.breakpoints.down('xs'))

    const content = (<>
        <div className={classes.asideHeader}>
            <Typography className={classes.asideHeaderTypography} variant='h4' align='center'>{asideTitle}</Typography>
            <IconButton onClick={toggleDrawer}>
                {theme.direction === 'ltr' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
        </div>
        <div className={classes.asideContainer}>
            {aside}
        </div>
    </>)

    return (
        <div className={classes.root} {...otherProps}>
            <Topbar />
            <Hidden smUp implementation="js">
                <Dialog
                    open={xsDown && open}
                    onClose={toggleDrawer}
                    fullScreen
                    keepMounted
                    transitionDuration={{
                        enter: theme.transitions.duration.enteringScreen,
                        exit: theme.transitions.duration.leavingScreen,
                    }}
                >
                    {content}
                </Dialog>
            </Hidden>
            <Hidden xsDown implementation="js">
                <Drawer
                    hidden={!aside}
                    className={clsx(classes.asideWrapper, classes.aside2Wrapper)}
                    variant='permanent'
                    anchor={theme.direction === 'ltr' ? 'right' : 'left'}
                    PaperProps={{component: 'aside', className: clsx(classes.aside, classes.aside2)}}
                    {...asideProps}
                >
                    <Toolbar />
                    <div className={clsx(classes.asideHeader, classes.aside2Header)}>
                        <IconButton onClick={toggleDrawer} color='primary'>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                        </IconButton>
                    </div>
                </Drawer>
                <Drawer
                    className={classes.asideWrapper}
                    variant='persistent'
                    anchor={theme.direction === 'ltr' ? 'right' : 'left'}
                    PaperProps={{component: 'aside', className: classes.aside}}
                    open={open}
                    {...asideProps}
                >
                    <Toolbar />
                    {content}
                </Drawer>
            </Hidden>
            <Toolbar />
            <div className={classes.mainWrapper}>
                <main className={clsx(classes.main, className)} {...mainProps}>
                    {children}
                </main>
            </div>
            <Hidden smUp implementation="css">
                <Fab
                    className={classes.fab}
                    color="primary"
                    aria-label="edit"
                    onClick={toggleDrawer}
                >
                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </Fab>
            </Hidden>
        </div>
    )
})) /* ============================================================================================================= */

const drawerWidth = 420
const buttonWidth = 40
