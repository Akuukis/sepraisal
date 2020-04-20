import * as React from 'react'
import { hot } from 'react-hot-loader/root'
import classnames from 'classnames'

import { Grid, Typography, GridProps } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../common/'
import MyCell from './MyCell'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    value: {
        maxWidth: '100%',
    },

    label: {
        maxWidth: '100%',
        textOverflow: 'clip',
    },
})


interface IProps extends GridProps {
    label?: string | number
    value?: string | number
    wide?: boolean
}


export default hot(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {
    const {label, value, wide, className, ...otherProps} = props
    const labelFormatted = label !== undefined ? String(label) : '\u00A0'
    const valueFormatted = value !== undefined ? String(value) : '\u00A0'

    return (
        <MyCell
            direction='column'
            className={classnames(classes.root, className)}
            {...(wide ? {xs: 12, sm: 6} : {})}
            {...otherProps}
        >
            <Typography
                className={classes.value}
                noWrap
                display='block'
                variant='subtitle2'
                component='em'
                align='center'
            >
                {valueFormatted}
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
                {labelFormatted}
            </Typography>
        </MyCell>
    )
})) /* ============================================================================================================= */
