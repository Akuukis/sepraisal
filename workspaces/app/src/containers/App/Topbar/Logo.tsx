import * as React from 'react'
import { hot } from 'react-hot-loader/root'
import { Link } from 'react-router-dom'

import { Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../../common/'
import { ROUTES } from '../../../constants/routes'


const styles = (theme: IMyTheme) => createStyles({
    root: {
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

    return (
        <Typography variant='h5' className={classes.root} noWrap>
            <Link to={ROUTES.HOME} className={classes.link}>
                S<span className={classes.expand}>pace&nbsp;</span>E<span className={classes.expand}>ngineers</span>&nbsp;<strong>Praisal</strong>
            </Link>
        </Typography>
    )
})) /* ============================================================================================================= */
