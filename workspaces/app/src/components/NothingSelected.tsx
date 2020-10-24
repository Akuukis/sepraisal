import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Card, CardContent, CardHeader, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        backgroundColor: theme.palette.warning.main,
        margin: theme.spacing(2),
    },

    header: {
        textAlign: 'center',
    },
    content: {
    },
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    return (
        <Card className={classes.root}>
            <CardHeader className={classes.header} titleTypographyProps={{variant:'h3'}} title='No blueprint selected.' />
            <CardContent className={classes.content}>
                <Typography paragraph>
                    Please open and use the panel to select a blueprint.
                </Typography>
            </CardContent>
        </Card>
    )
})) /* ============================================================================================================= */
