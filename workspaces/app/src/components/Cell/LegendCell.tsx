import classnames from 'classnames'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Typography, TypographyProps } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../common/'
import CenterCell, { IProps as ICenterCellProps } from './CenterCell'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    legend: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        width: `calc(100% - ${theme.spacing(1) * 2}px)`,
        display: 'inline-block',
        textOverflow: 'clip',
        // color: theme.palette.success.dark,
    },
})


interface IProps extends ICenterCellProps {
    legend?: React.ReactNode
    legendProps?: TypographyProps<'legend'>
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {legend, legendProps, className, ...otherProps} = props

    return (
        <CenterCell
            direction='column'
            className={classnames(classes.root, className)}
            {...otherProps}
        >
            <Typography
                className={classes.legend}
                noWrap
                display='block'
                variant='subtitle2'
                component='legend'
                align='left'
                {...legendProps}
            >
                {legend}
            </Typography>
        </CenterCell>
    )
})) /* ============================================================================================================= */
