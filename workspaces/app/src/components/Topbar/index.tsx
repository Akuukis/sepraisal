import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { AppBar, fade, Toolbar } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../common/'
import Logo from './Logo'
import Navigation from './Navigation'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        backgroundColor: fade(theme.palette.primary.main, 0.8),
        zIndex: theme.zIndex.appBar + 1,
    },
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {

    return (
        <AppBar elevation={0} className={classes.root}>
            <Toolbar>
                <Logo />
                <div style={{flex: 1}} />
                <Navigation />
            </Toolbar>
        </AppBar>
    )
})) /* ============================================================================================================= */
