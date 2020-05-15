import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Card, CardContent, CardHeader, PaperProps, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        margin: theme.spacing(2),
        borderTopLeftRadius: theme.shape.borderRadius * 2,  // So that it doesn't anti-alise with heading.
        borderTopRightRadius: theme.shape.borderRadius * 2,  // So that it doesn't anti-alise with heading.
    },

    content: {
    },
    header: {
        backgroundColor: theme.palette.primary.dark,
    },
    heading: {
        color: theme.palette.primary.contrastText,
        borderTopLeftRadius: theme.shape.borderRadius,
        borderTopRightRadius: theme.shape.borderRadius,
    },
})


interface IProps extends PaperProps {
    heading: React.ReactNode,
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {heading, className, ...otherProps} = props

    const title = (
        <Typography className={classes.heading} variant='h2'>
            {heading}
        </Typography>
    )

    return (
        <Card className={clsx(classes.root, className)} {...otherProps}>
            <CardHeader className={classes.header} title={title} />
            <CardContent className={classes.content}>
                {children}
            </CardContent>
        </Card>
    )
})) /* ============================================================================================================= */
