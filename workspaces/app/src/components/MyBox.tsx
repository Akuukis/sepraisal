import * as React from 'react'
import { hot } from 'react-hot-loader/root'
import classnames from 'classnames'

import { Grid, GridProps } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../common'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        width: `${268}px`,
    },

    wide: {
        width: `${268 * 2}px`,
    }
})


interface IProps extends GridProps {
    wide?: boolean
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {className, wide, ...otherProps} = props

    return (
        <Grid
            container
            className={classnames(classes.root, wide && classes.wide, className)}
            spacing={0}
            justify='space-between'
            alignItems='stretch'
            {...otherProps}
        >
            {children}
        </Grid>
    )
})) /* ============================================================================================================= */
