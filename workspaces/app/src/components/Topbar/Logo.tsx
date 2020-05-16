import * as React from 'react'
import { hot } from 'react-hot-loader/root'
import { Link } from 'react-router-dom'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import { ROUTES } from 'src/constants/routes'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        fontFamily: theme.typography.fontFamily,
        fontSize: '1.5rem',
        textTransform: 'uppercase',
        color: theme.palette.primary.contrastText,
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

    return (
        <Link to={ROUTES.HOME} className={classes.root}>
            S<span className={classes.expand}>pace&nbsp;</span>E<span className={classes.expand}>ngineers</span>&nbsp;<strong>Praisal</strong>
        </Link>
    )
})) /* ============================================================================================================= */
