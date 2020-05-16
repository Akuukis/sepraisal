import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import {
    Dialog,
    Drawer,
    DrawerProps,
    GridProps,
    IconButton,
    Toolbar,
    Typography,
    useMediaQuery,
} from '@material-ui/core'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'

import { createSmartFC, createStyles, dropShadowFromBoxShadow, IMyTheme } from 'src/common'


const styles = (theme: IMyTheme) => createStyles({
    root: {
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
            borderRadius: theme.direction === 'ltr' ? `${theme.shape.borderRadius}px 0 0 0` : `0 ${theme.shape.borderRadius}px 0 0`,
            marginTop: theme.spacing(2),
        },

        zIndex: 1,
        filter: dropShadowFromBoxShadow(theme.shadows[1]),
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(1, 1),
        justifyContent: 'flex-end',
        backgroundColor: theme.palette.background.paper,
    },
    asideHeaderTypography: {
        flexGrow: 1,
    },
    asideContainer: {
        padding: theme.spacing(0, 4, 4, 4),
        overflowX: 'hidden',
        backgroundColor: theme.palette.background.paper,
        '&::after': {
            content: ' '
        },
        borderRadius: theme.direction === 'ltr' ? `0 0 0 ${theme.shape.borderRadius}px` : `0 0 ${theme.shape.borderRadius}px 0`,
    },
    aside2Wrapper: {
        width: buttonWidth,
    },
    aside2: {
        width: buttonWidth,
    },
    aside2Header: {
        borderRadius: theme.direction === 'ltr' ? `${theme.shape.borderRadius}px 0 0 ${theme.shape.borderRadius}px` : `0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px 0`,
    },
})


interface IProps extends GridProps {
    aside?: React.ReactNode,
    asideIcon?: React.ReactNode,
    asideTitle?: string,
    asideProps?: DrawerProps,
    open: boolean,
    toggleOpen: () => void,
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {aside, asideIcon, asideProps, asideTitle, open, toggleOpen, className, ...otherProps} = props
    const xsDown = useMediaQuery(theme.breakpoints.down('xs'))

    const asideContent = (<>
        <div className={classes.asideHeader}>
            <Typography className={classes.asideHeaderTypography} variant='h2'>{asideTitle}</Typography>
            <IconButton onClick={toggleOpen}>
                {theme.direction === 'ltr' ? <ChevronRightIcon fontSize='default' /> : <ChevronLeftIcon fontSize='default' />}
            </IconButton>
        </div>
        <div className={classes.asideContainer}>
            {aside}
        </div>
    </>)

    if(!aside) return null

    return xsDown ?
        (
            <Dialog
                open={xsDown && open}
                onClose={toggleOpen}
                fullScreen
                keepMounted
                transitionDuration={{
                    enter: theme.transitions.duration.enteringScreen,
                    exit: theme.transitions.duration.leavingScreen,
                }}
            >
                {asideContent}
            </Dialog>
        )
        :
        (<>
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
                    <IconButton onClick={toggleOpen} color='primary'>
                        {asideIcon}
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
                {asideContent}
            </Drawer>
        </>)
})) /* ============================================================================================================= */

const drawerWidth = 420
const buttonWidth = 56
