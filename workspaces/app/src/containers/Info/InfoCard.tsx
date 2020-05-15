import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Paper, PaperProps, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        margin: theme.spacing(2),
        borderTopLeftRadius: theme.shape.borderRadius * 2,  // So that it doesn't anti-alise with heading.
        borderTopRightRadius: theme.shape.borderRadius * 2,  // So that it doesn't anti-alise with heading.
    },

    content: {
        padding: theme.spacing(1),
    },
    heading: {
        ...theme.typography.h4,
        backgroundColor: theme.palette.primary.dark,
        color: theme.palette.primary.contrastText,
        padding: theme.spacing(2),
        borderTopLeftRadius: theme.shape.borderRadius,
        borderTopRightRadius: theme.shape.borderRadius,
        textAlign: 'center',
    },
})


interface IProps extends PaperProps {
    heading: React.ReactNode,
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {heading, className, ...otherProps} = props

    return (
        <Paper className={clsx(classes.root, className)} {...otherProps}>
            <Typography className={classes.heading} variant='h2' gutterBottom>
                {heading}
            </Typography>
            <Paper className={classes.content}>
                {children}
            </Paper>
        </Paper>
    )
})) /* ============================================================================================================= */
