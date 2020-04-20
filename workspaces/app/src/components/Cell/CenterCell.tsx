import * as React from 'react'
import { hot } from 'react-hot-loader/root'
import classnames from 'classnames'

import { Grid, GridProps } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../common/'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        '&:first-child': {
            paddingLeft: theme.spacing(2),
        },
        '&:last-child': {
            paddingRight: theme.spacing(2),
        },
        paddingBottom: theme.spacing(1),
        paddingTop: theme.spacing(1),
    },
})


export interface IProps extends GridProps {
    wide?: boolean
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {className, wide, ...otherProps} = props

    return (
        <Grid
            className={classnames(classes.root, className)}

            item
            {...(wide ? {xs: 12, sm: 6} : {xs: 6, sm: 3})}

            container
            justify='center'
            alignItems='center'

            {...otherProps}
        >
            {children}
        </Grid>
    )
})) /* ============================================================================================================= */
