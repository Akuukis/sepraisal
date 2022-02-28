import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Card, CardContent, CardHeader, Container, fade, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import { PROVIDER } from 'src/constants'
import { CONTEXT } from 'src/stores'

import PanelSteam from './PanelSteam'
import PanelUpload from './PanelUpload'
import { Alert, AlertTitle } from '@material-ui/lab'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        backgroundColor: 'transparent',
        marginTop: theme.spacing(1),
        marginBottom: theme.spacing(1),
    },
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    return (
        <Container className={classes.root} maxWidth="sm">
            <Alert severity='warning'>
                <AlertTitle>Browse is offline. Analyzing uploads in browser still work.</AlertTitle>
                <Typography paragraph>
                    The volunteer responsible for maintaining the Browse server lives in Ukraine.
                    He has a "little problem" over there.
                    Please be understanding, and let's hope the best for him.
                </Typography>
                <Typography paragraph variant='caption'>
                    If you want to volunteer with a server, please contact Akuukis.
                </Typography>
            </Alert>
        </Container>
    )
})) /* ============================================================================================================= */
