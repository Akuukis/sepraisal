import * as React from 'react'
import { hot } from 'react-hot-loader/root'
import { Link } from 'react-router-dom'

import { AppBar, Badge, fade, Toolbar, Typography } from '@material-ui/core'
import IconAnalyze from '@material-ui/icons/BarChart'
import IconCompare from '@material-ui/icons/CompareArrows'
import IconInfo from '@material-ui/icons/InfoOutlined'
import IconSearch from '@material-ui/icons/Search'

import { createSmartFC, createStyles, IMyTheme } from '../common/'
import { ROUTES } from '../constants/routes'
import { CONTEXT } from '../stores'
import TopbarButton from './TopbarButton'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        backgroundColor: fade(theme.palette.primary.main, 0.8),
        zIndex: theme.zIndex.appBar + 1,
    },

    badge: {
        right: `1.2em`,
        top: `1.2em`,
    },
    headline: {
        color: theme.palette.primary.contrastText,
    },
    link: {
        color: 'inherit',
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
        }
    },
    expand: {
        transition: theme.transitions.create('max-width'),
        maxWidth: 120,
        overflowX: 'hidden',
        verticalAlign: 'bottom',
        [theme.breakpoints.down('sm')]: {
            display: 'inline-block',
            maxWidth: 0,
        },
    },
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const selectionStore = React.useContext(CONTEXT.SELECTION)

    return (
        <AppBar elevation={0} className={classes.root}>
            <Toolbar>
                <Typography variant='h5' className={classes.headline} noWrap>
                    <Link to={ROUTES.HOME} className={classes.link}>
                        S<span className={classes.expand}>pace&nbsp;</span>E<span className={classes.expand}>ngineers</span>&nbsp;<strong>Praisal</strong>
                    </Link>
                </Typography>
                <div style={{flex: 1}} />
                <TopbarButton to={ROUTES.BROWSE} Icon={IconSearch} title='Browse' />
                <TopbarButton to={ROUTES.BLUEPRINT} Icon={IconAnalyze} title='Analyze' />
                <Badge classes={{badge: classes.badge}} badgeContent={selectionStore.selected.length} color="secondary">
                    <TopbarButton to={ROUTES.COMPARE} Icon={IconCompare} title='Compare' />
                </Badge>
                <TopbarButton to={ROUTES.INFO} Icon={IconInfo} title='Info' />
            </Toolbar>
        </AppBar>
    )
})) /* ============================================================================================================= */
