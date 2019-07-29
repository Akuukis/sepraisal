import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../common/'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },
    key: {
        fontSize: '.67rem',
    },
    value: {
        fontStretch: 'condensed',
    },
})


interface IProps {
    def: string | number
    value: string | number
    // tslint:disable-next-line: max-union-size
    width?: 8 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 9 | 10 | 11 | 12
}


export default hot(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {
    const def = 'def' in props ? String(props.def) : '\u00A0'
    const value = 'value' in props ? String(props.value) : '\u00A0'
    const width = 'width' in props ? props.width : 3

    return (
        <Grid item xs={width} className={classes.root}>
            <Typography
                noWrap
                variant='subtitle2'
                align='center'
                className={classes.value}
            >
                {value}
            </Typography>
            <Typography
                noWrap
                align='center'
                variant='caption'
                component='p'
                color='textSecondary'
                className={classes.key}
            >
                {def}
            </Typography>
        </Grid>
    )
})) /* ============================================================================================================= */
