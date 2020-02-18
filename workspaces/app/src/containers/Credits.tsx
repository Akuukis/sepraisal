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
                        Please create a ticket at <a href='https://gitlab.com/akuukis/sepraisal/issues'>GitLab issues</a>, thanks!
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} md={10} lg={8}>
                <Paper className={classes.content}>
                    <Typography variant='h4' gutterBottom>Credits</Typography>
                    <Divider />
                    <Typography variant='h5'>Author</Typography>
                    <Typography component='div' paragraph>
                        <ul>
                            <li>Akuukis (contact me
                                on: <a href='https://steamcommunity.com/id/akuukis'>Steam</a>
                                , <a href='https://github.com/Akuukis'>Github</a>
                                , <a href='https://gitlab.com/Akuukis'>GitLab</a>
                                , or Discord: Akuukis#6154)
                            </li>
                        </ul>
                    </Typography>
                    <Typography variant='h5'>Contributors</Typography>
                    <Typography component='div' paragraph>
                        <ul>
                            <li>kainz (<a href='https://github.com/Akuukis/spaceengineers-praisal/pull/3'>PR#3</a>)</li>
                            <li>Aleksis Zalitis (<a href='https://gitlab.com/akuukis/sepraisal/merge_requests/1'>MR!1</a>)</li>
                        </ul>
                    </Typography>
                    <Typography variant='h5'>Keen Software House</Typography>
                    <Typography paragraph>
                        <a href='https://www.keenswh.com/'>You</a> are great! Thanks for making <a href='https://www.spaceengineersgame.com/'>Space Engineers</a> :)
                    </Typography>
                    <Typography paragraph>Game assets are used with Keen Software House permission in personal communication.</Typography>
                </Paper>
            </Grid>
        </Grid>
    )
})) /* ============================================================================================================= */
