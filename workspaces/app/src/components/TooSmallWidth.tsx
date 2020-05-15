import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Card, CardContent, CardHeader, Grid, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme, useWindowDimensions } from 'src/common'
import IconScreenRotation from 'src/components//icons/IconScreenRotation'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        backgroundColor: theme.palette.warning.light,
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
    const {width} = useWindowDimensions()

    return (
        <Card className={classes.root}>
            <CardHeader className={classes.header} title='Screen is too narrow.' />
            <CardContent className={classes.content}>
                <Grid container justify='center' alignItems='flex-start' spacing={2}>
                    <Grid item>
                        <Typography align='center' variant='subtitle1'>{width} px</Typography>
                        <Typography align='center' variant='caption'>your screen width</Typography>
                    </Grid>
                    <Grid item>
                        <Typography align='center' variant='subtitle1'>{'<'}</Typography>
                    </Grid>
                    <Grid item>
                        <Typography align='center' variant='subtitle1'>600 px</Typography>
                        <Typography align='center' variant='caption'>required screen width</Typography>
                    </Grid>
                </Grid>
            </CardContent>
            <CardContent className={classes.content}>
                <Grid container justify='center' alignItems='center' spacing={2}>
                    <Grid item>
                        <IconScreenRotation fontSize='large' />
                    </Grid>
                    <Grid item>
                        <Typography align='center'>
                            Try landscape mode
                        </Typography>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
})) /* ============================================================================================================= */
