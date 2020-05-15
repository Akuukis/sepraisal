import classnames from 'classnames'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Typography, TypographyProps } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'

import CenterCell, { IProps as ICenterCellProps } from './CenterCell'


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


interface IProps extends ICenterCellProps {
    label?: React.ReactNode
    value?: React.ReactNode
    valueProps?: TypographyProps
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {label, value, valueProps, className, ...otherProps} = props
    const labelFormatted = label !== undefined ? label : '\u00A0'
    const valueFormatted = value !== undefined ? value : '\u00A0'

    return (
        <CenterCell
            direction='column'
            className={classnames(classes.root, className)}
            {...otherProps}
        >
            <Typography
                className={classes.value}
                noWrap
                display='block'
                variant='body2'
                component='span'
                align='center'
                {...valueProps}
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
        </CenterCell>
    )
})) /* ============================================================================================================= */
