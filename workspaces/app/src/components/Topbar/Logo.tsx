import * as React from 'react'
import { hot } from 'react-hot-loader/root'
import { NavLink } from 'react-router-dom'

import { fade } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import { ROUTES } from 'src/constants'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        fontFamily: theme.typography.fontFamily,
        fontSize: '1.5rem',
        textTransform: 'uppercase',
        color: theme.palette.primary.contrastText,
        textDecoration: 'none',
        '&:hover': {
            backgroundColor: fade('#000', 0.4),
        },
        padding: theme.spacing(2, 2),
        height: 48,
        boxSizing: 'border-box',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },

    active: {
        backgroundColor: fade('#000', 0.2),
        borderBottom: `${theme.spacing(0.5)}px solid`,
        paddingTop: theme.spacing(2.5),
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

    return (
        <NavLink
            to={ROUTES.HOME}
            className={classes.root}
            activeClassName={classes.active}
            exact
        >
            S<span className={classes.expand}>pace&nbsp;</span>E<span className={classes.expand}>ngineers</span>&nbsp;<strong>Praisal</strong>
        </NavLink>
    )
})) /* ============================================================================================================= */
