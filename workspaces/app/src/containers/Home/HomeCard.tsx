import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Card, CardContent, CardHeader, PaperProps, SvgIconProps, Typography } from '@material-ui/core'

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
    icon: {
        verticalAlign: 'middle',
        marginRight: theme.spacing(1),
    },
})


interface IProps extends PaperProps {
    Icon: React.FunctionComponent<SvgIconProps>,
    heading: React.ReactNode,
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {Icon, heading, className, ...otherProps} = props

    const title = (<>
        <Typography className={classes.heading} variant='h2'>
            <Icon fontSize='large' className={classes.icon} />
            {heading}
        </Typography>
    </>)

    return (
        <Card className={clsx(classes.root, className)} {...otherProps}>
            <CardHeader className={classes.header} title={title} />
            <CardContent className={classes.content}>
                {children}
            </CardContent>
        </Card>
    )
})) /* ============================================================================================================= */
