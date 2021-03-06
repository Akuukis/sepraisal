import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { darken, fade, Grid, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'


interface IProps {
}


const styles = (theme: IMyTheme) => createStyles({
    root: {
        background: fade(darken(theme.palette.background.default, 0.6), 0.4),
        bottom: -theme.spacing(1.5),
        left: -theme.spacing(1.5),
        position: 'absolute',
        right: -theme.spacing(1.5),
        top: -theme.spacing(1.5),
        width: 'unset',
    },

    text: {
        color: theme.palette.primary.contrastText,
    }
})


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    return (
        <Grid container className={classes.root} alignItems='center' justify='center'>
            <Grid item>
                <Typography component='span' variant='body1' className={classes.text}>Drop files here</Typography>
            </Grid>
        </Grid>
    )
})) /* ============================================================================================================= */
