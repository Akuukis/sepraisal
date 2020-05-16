import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { DrawerProps, GridProps, Toolbar } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import Topbar from 'src/components/Topbar'

import skyboxImage from '../../static/skybox.jpg'
import DefaultLayoutFab from './DefaultLayoutFab'
import DefaultLayoutPanel from './DefaultLayoutPanel'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        background: theme.palette.background.default,
        backgroundImage: `url(${skyboxImage})`,
        minHeight: '100vh',
        minWidth: 300,  // That's minium.
        overflow: 'hidden',
    },

    mainWrapper: {
        minHeight: 'calc(100vh - 48px)',  // Minus dense toolbar.
        [theme.breakpoints.up('sm')]: {
            minHeight: 'calc(100vh - 48px)',  // Minus dense toolbar.
        },
        overflowX: 'auto',
    },
    main: {
        minWidth: '100%',
        minHeight: '100%',
        boxSizing: 'border-box',
        padding: theme.spacing(1),
    },
})


interface IProps extends GridProps {
    aside?: React.ReactNode,
    asideTitle?: string,
    asideIcon?: React.ReactNode,
    asideProps?: DrawerProps,
    mainProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>,
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {aside, asideIcon, asideProps, asideTitle, mainProps, className, ...otherProps} = props
    const [open, setOpen] = React.useState(!!aside)
    const toggleModal = (event?: React.KeyboardEvent | React.MouseEvent) => {
        setOpen(!open)
    }

    return (
        <div className={classes.root} {...otherProps}>
            <Topbar />
            <DefaultLayoutPanel
                aside={aside}
                asideIcon={asideIcon}
                asideTitle={asideTitle}
                asideProps={asideProps}
                open={open}
                toggleOpen={toggleModal}
            />
            <Toolbar />
            <div className={classes.mainWrapper}>
                <main className={clsx(classes.main, className)} {...mainProps}>
                    {children}
                </main>
            </div>
            <DefaultLayoutFab
                aside={aside}
                asideIcon={asideIcon}
                toggleOpen={toggleModal}
            />
        </div>
    )
})) /* ============================================================================================================= */

const drawerWidth = 420
const buttonWidth = 40
