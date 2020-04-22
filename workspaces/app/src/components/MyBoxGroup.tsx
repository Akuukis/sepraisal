import classnames from 'classnames'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid, GridProps } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../common'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        margin: 0,
    },
})


interface IProps extends GridProps {
    height?: 1 | 2 | 3 | 4 | 5 | 6
    width?: 1 | 2 | 3 | 4 | 5 | 6
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {className, height, width, ...otherProps} = props
    const heightOrDefault = height ?? 1
    const widthOrDefault = width ?? 6

    return (
        <Grid
            className={classnames(classes.root, className)}
            style={{height: heightOrDefault * 42 + theme.spacing(2)}}

            item
            xs={widthOrDefault * 2 as any}

            container
            spacing={1}
            justify='space-between'
            alignItems='stretch'
            {...otherProps}
        >
            {children}
        </Grid>
    )
})) /* ============================================================================================================= */
