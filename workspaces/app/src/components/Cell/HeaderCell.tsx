import * as React from 'react'
import { hot } from 'react-hot-loader/root'
import classnames from 'classnames'

import { Grid, Typography, GridProps } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../common/'
import MyCell from './MyCell'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        backgroundColor: theme.palette.secondary.main,
    },

    title: {
        width: '100%',
    },
})


interface IProps extends GridProps {
    title: string
}


export default hot(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {
    const {title,  className, ...otherProps} = props

    return (
        <MyCell
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
        </MyCell>
    )
})) /* ============================================================================================================= */
