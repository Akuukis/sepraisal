import * as React from 'react'
import { hot } from 'react-hot-loader/root'
import classnames from 'classnames'

import { Grid, GridProps } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../common'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },
})


interface IProps extends GridProps {
    wide?: boolean
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {className, wide, ...otherProps} = props

    return (
        <Grid
            className={classnames(classes.root, className)}

            item
            {...(wide ? {xs: 12} : {xs: 12, sm: 6})}

            container
            spacing={0}
            justify='space-between'
            alignItems='stretch'

            {...otherProps}
        >
            {children}
        </Grid>
    )
})) /* ============================================================================================================= */
