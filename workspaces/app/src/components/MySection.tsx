import classnames from 'classnames'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid, GridProps } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../common'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        backgroundColor: theme.palette.background.paper,
        borderRadius: `${theme.spacing(1)}px`,
        width: `${268 * 2}px`,
    },
})


interface IProps extends GridProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {className, ...otherProps} = props

    return (
        <Grid
            component='section'
            item
            container
            className={classnames(classes.root, className)}
            spacing={0}
            justify='space-between'
            alignItems='stretch'
            {...otherProps}
        >
            {children}
        </Grid>
    )
})) /* ============================================================================================================= */
