import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid, Typography, GridProps } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../common/'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        '&:first-child': {
            paddingLeft: theme.spacing(2),
        },
        '&:last-child': {
            paddingRight: theme.spacing(2),
        },
        paddingBottom: theme.spacing(1),
        paddingTop: theme.spacing(1),
    },

    value: {
    },

    label: {
        textOverflow: 'clip',
    },
})


interface IProps extends GridProps {
    label?: string | number
    value?: string | number
}


export default hot(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {
    const {label: defProps, value: valueProps, ...otherProps} = props
    const label = defProps !== undefined ? String(defProps) : '\u00A0'
    const value = valueProps !== undefined ? String(valueProps) : '\u00A0'

    return (
        <Grid item className={classes.root} xs={3} {...otherProps}>
            <Typography
                className={classes.value}
                noWrap
                display='block'
                variant='subtitle2'
                component='em'
                align='center'
            >
                {value}
            </Typography>
            <Typography
                className={classes.label}
                noWrap
                align='center'
                variant='caption'
                component='label'
                color='textSecondary'
                display='block'
            >
                {label}
            </Typography>
        </Grid>
    )
})) /* ============================================================================================================= */
