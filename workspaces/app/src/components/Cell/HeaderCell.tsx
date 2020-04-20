import * as React from 'react'
import { hot } from 'react-hot-loader/root'
import classnames from 'classnames'

import { Grid, Typography, GridProps } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../common/'
import CenterCell from './CenterCell'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        backgroundColor: theme.palette.secondary.main,
        borderTopLeftRadius: `${theme.spacing(1)}px`,
    },

    title: {
        width: '100%',
    },
})


interface IProps extends GridProps {
    title: string
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {title,  className, ...otherProps} = props

    return (
        <CenterCell
            className={classnames(classes.root, className)}
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
