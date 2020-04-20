import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid, Typography, GridProps } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../common/'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },
})


interface IProps extends GridProps {
    label?: string | number
    value?: string | number
}


export default hot(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {
    const {label: defProps, value: valueProps, ...otherProps} = props
    const def = defProps !== undefined ? String(defProps) : '\u00A0'
    const value = valueProps !== undefined ? String(valueProps) : '\u00A0'

    return (
        <Grid item className={classes.root} {...otherProps}>
            <Typography
                noWrap
                display='block'
                variant='subtitle2'
                component='em'
                align='center'
            >
                {value}
            </Typography>
            <Typography
                noWrap
                align='center'
                variant='caption'
                component='label'
                color='textSecondary'
                display='block'
            >
                {def}
            </Typography>
        </Grid>
    )
})) /* ============================================================================================================= */
