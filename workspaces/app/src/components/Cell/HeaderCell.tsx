import classnames from 'classnames'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../common/'
import CenterCell, { IProps as ICenterCellProps } from './CenterCell'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        paddingLeft: theme.spacing(3),
    },

    title: {
        width: '100%',
        color: theme.palette.success.contrastText,
    },
})


interface IProps extends ICenterCellProps {
    title: string
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {title,  className, ...otherProps} = props

    return (
        <CenterCell
            className={classnames(classes.root, className)}
            width={2}
            {...otherProps}
        >
            <Typography
                variant='h6'
                display='block'
                noWrap
                className={classes.title}
            >
                {title}
            </Typography>
        </CenterCell>
    )
})) /* ============================================================================================================= */
