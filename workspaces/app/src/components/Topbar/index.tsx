import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { AppBar, Toolbar } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'

import Logo from './Logo'
import Navigation from './Navigation'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        backgroundColor: theme.palette.primary.main,
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
