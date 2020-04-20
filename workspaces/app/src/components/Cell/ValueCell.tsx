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
    const {label: defProps, value: valueProps, className, ...otherProps} = props
    const label = defProps !== undefined ? String(defProps) : '\u00A0'
    const value = valueProps !== undefined ? String(valueProps) : '\u00A0'

    return (
        <MyCell className={classnames(classes.root, className)} {...otherProps}>
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
        </MyCell>
    )
})) /* ============================================================================================================= */
