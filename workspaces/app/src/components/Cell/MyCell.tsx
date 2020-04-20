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


interface IProps extends GridProps {
}


export default hot(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {
    const {className, ...otherProps} = props

    return (
        <Grid
            item
            container
            xs={6}
            sm={3}
            className={classnames(classes.root, className)}
            justify='center'
            alignItems='center'
            {...otherProps}
        >
            {children}
        </Grid>
    )
})) /* ============================================================================================================= */
