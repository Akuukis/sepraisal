import classnames from 'classnames'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid, GridProps } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../common/'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        // '&:first-child': {
        //     paddingLeft: theme.spacing(2),
        // },
        // '&:last-child': {
        //     paddingRight: theme.spacing(2),
        // },
        // paddingBottom: theme.spacing(1),
        // paddingTop: theme.spacing(1),
        // height: 50 - theme.spacing(2),
    },

    padded: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
    }
})


export interface IProps extends GridProps {
    padded?: boolean
    double?: boolean
    triple?: boolean
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {className, padded, double, triple, ...otherProps} = props

    return (
        <Grid
            className={classnames(classes.root, padded && classes.padded, className)}

            item
            {...(triple ? {xs: 12, sm: 12} : double ? {xs: 8, sm: 8} : {xs: 4, sm: 4})}

            container
            justify='center'
            alignItems='center'

            {...otherProps}
        >
            {children}
        </Grid>
    )
})) /* ============================================================================================================= */
