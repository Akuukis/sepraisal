import * as React from 'react'
import { hot } from 'react-hot-loader/root'
import classnames from 'classnames'

import { Grid, GridProps, Paper } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../common'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        width: `${268 * 2}px`,
    },

    container: {
    },
})


interface IProps extends GridProps {
}


export default hot(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {
    const {className, ...otherProps} = props

    return (
        <Paper className={classnames(classes.root, className)}>
            <Grid
                container
                className={classes.container}
                spacing={0}
                justify='space-between'
                alignItems='stretch'
                {...otherProps}
            >
                {children}
            </Grid>
        </Paper>
    )
})) /* ============================================================================================================= */
