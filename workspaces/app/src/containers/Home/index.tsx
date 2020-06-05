import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import Search from 'src/components/Search'
import DefaultLayout from 'src/layouts/DefaultLayout'

import banner from '../../../static/Space Engineers - Red vs. Blue - IratusAvis.jpg'
import Analyse from './Analyse'
import Browse from './Browse'
import Compare from './Compare'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        [theme.breakpoints.up('sm')]: {
            backgroundImage: `url(${encodeURI(banner)})`,
            backgroundPositionX: 'center',
            backgroundSize: 'cover',
        },
        minHeight: 'calc(100vh - 48px)',  // Minus dense toolbar.
        display: 'flex',
        flexDirection: 'column',
    },

    center: {
        flexGrow: 1,
        [theme.breakpoints.down('xs')]: {
            minHeight: 'calc(100vh - 48px)',  // Minus dense toolbar.
            backgroundImage: `url(${encodeURI(banner)})`,
            backgroundPositionX: 'center',
            backgroundSize: 'cover',

            // Hack around global padding.
            margin: theme.spacing(-2, -2, 0, -2),
            width: `calc(100% + ${theme.spacing(4)}px)`,
            padding: theme.spacing(2),
        }
    },
    bottom: {
        flexGrow: 0,
    },
    search: {
        padding: theme.spacing(2),
    }
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {

    return (
        <DefaultLayout className={classes.root}>
            <Grid container justify='center' alignItems='center' className={classes.center}>
                <Grid item xs>
                    <Search className={classes.search} disableSort disableStatus />
                </Grid>
            </Grid>
            <Grid item xs container justify='center' className={classes.bottom}>
                <Grid item xs={12} sm={6} md={4} xl={3}>
                    <Browse />
                </Grid>
                <Grid item xs={12} sm={6} md={4} xl={3}>
                    <Analyse />
                </Grid>
                <Grid item xs={12} sm={12} md={4} xl={3}>
                    <Compare />
                </Grid>
            </Grid>
        </DefaultLayout>
    )
})) /* ============================================================================================================= */
