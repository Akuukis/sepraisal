import { SERVICE_DESK_EMAIL } from '@sepraisal/common'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Divider, Grid, Paper, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../common/'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        padding: '0.5em',
    },

    content: {
        padding: '0.5em',
    },
})


interface IProps {
}


export default hot(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {

    return (
        <Grid container spacing={2} justify='center' className={classes.root}>
            <Grid item xs={12} md={10} lg={8}>
                <Paper className={classes.content}>
                    <Typography variant='h4' gutterBottom>Support</Typography>
                    <Divider />
                    <Typography paragraph>
                        Found a bug? Something is not working or is confusing?
                    </Typography>
                    <Typography paragraph>
                        Please send a email to <a href={`mailto:${SERVICE_DESK_EMAIL}`}>{SERVICE_DESK_EMAIL}</a> describing it.
                        Please attach screenshots, that helps a lot.
                        Your email will create a issue ticket <a href='//gitlab.com/akuukis/sepraisal/issues'>here</a> to easily track and respond to it.
                        Thank you!
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} md={10} lg={8}>
                <Paper className={classes.content}>
                    <Typography variant='h4' gutterBottom>Credits</Typography>
                    <Divider />
                    <Typography variant='h5'>Maintainers</Typography>
                    <Typography paragraph component='div'>
                        <ul>
                            <li>
                                <strong>Akuukis</strong> -
                                contact on: <a href='//github.com/Akuukis'>Github</a>, <a href='//gitlab.com/Akuukis'>GitLab</a>, or Discord: Akuukis#6154.
                            </li>
                            <li><em>... looking for maintainers (if interested, DM Akuukis) ...</em></li>
                        </ul>
                    </Typography>
                    <Typography variant='h5'>Keen Software House</Typography>
                    <Typography paragraph>
                        <a href='https://www.keenswh.com/'>You</a> are great! Thanks for making <a href='https://www.spaceengineersgame.com/'>Space Engineers</a> :)
                    </Typography>
                    <Typography variant='h5'>Legal</Typography>
                    <Typography paragraph>
                        This website is open-source (<a href='//choosealicense.com/licenses/gpl-3.0/'>GPLv3</a>).
                        You can find source code at <a href='//gitlab.com/akuukis/sepraisal'>Gitlab</a>.
                    </Typography>
                    <Typography paragraph>
                        Game assets are used with Keen Software House permission in personal communication with Akuukis.
                    </Typography>
                </Paper>
            </Grid>
        </Grid>
    )
})) /* ============================================================================================================= */
