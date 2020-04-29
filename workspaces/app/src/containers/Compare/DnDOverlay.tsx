import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../common'


interface IProps {
}


const styles = (theme: IMyTheme) => createStyles({
    root: {
        background: 'rgba(0,0,0,0.6)',
        bottom: -theme.spacing(1.5),
        left: -theme.spacing(1.5),
        position: 'absolute',
        right: -theme.spacing(1.5),
        top: -theme.spacing(1.5),
        width: 'unset',
    },
})


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    return (
        <Grid container className={classes.root} alignItems='center' justify='center'>
            <Grid item>
                <Typography component='span' variant='h4' style={{color: '#fff'}}>Drop files here</Typography>
            </Grid>
        </Grid>
    )
})) /* ============================================================================================================= */
