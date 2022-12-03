import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Card, CardContent, CardHeader, Container, fade, Link, Typography } from '@material-ui/core'

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
                <Typography>
                    SEPraisal is looking for maintainers.
                </Typography>
                <Typography>
                    See <Link href="https://github.com/Akuukis/sepraisal">Github</Link> or join <Link href="https://discord.gg/Ry93fePdHJ">Discord server</Link> to learn more.
                </Typography>
            </Alert>
        </Container>
    )
})) /* ============================================================================================================= */
