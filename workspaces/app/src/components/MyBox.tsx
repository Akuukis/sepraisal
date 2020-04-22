import classnames from 'classnames'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid, GridProps } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../common'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    paper: {
        backgroundColor: theme.palette.background.paper,
        height: '100%',
        color: theme.palette.text.primary,
        boxShadow: theme.shadows[theme.spacing(1)/2],
        transition: theme.transitions.create('box-shadow'),
    },
    h5Root: {
        // backgroundColor: theme.palette.secondary.main,
        borderTopLeftRadius: `${theme.spacing(1)}px`,
    },
    h5Paper: {
        boxShadow: theme.shadows[0],
    },
})


interface IProps extends GridProps {
    header?: boolean
    size?: 1 | 2 | 3 | 4 | 5 | 6
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {className, header, size, ...otherProps} = props
    const sizeOrDefault = (size ? size * 2 : 2) as 2 | 4 | 6 | 8 | 10 | 12

    return (
        <Grid
            className={classnames(classes.root, header && classes.h5Root, className)}

            item
            xs={sizeOrDefault}

            {...otherProps}
        >
            <Grid
                className={classnames(classes.paper, header && classes.h5Paper)}
                container
                spacing={0}
                justify='space-between'
                alignItems='stretch'
            >
                {children}
            </Grid>
        </Grid>
    )
})) /* ============================================================================================================= */
