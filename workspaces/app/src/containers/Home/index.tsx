import { getApiUrl, IBlueprint } from '@sepraisal/common'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Button, Grid, Paper, Typography } from '@material-ui/core'

import { ASYNC_STATE, createSmartFC, createStyles, IMyTheme } from 'src/common'
import IconAnalyse from 'src/components/icons/IconAnalyse'
import IconBrowse from 'src/components/icons/IconBrowse'
import IconCompare from 'src/components/icons/IconCompare'
import { ROUTES } from 'src/constants/routes'
import DefaultLayout from 'src/layouts/DefaultLayout'
import { CONTEXT } from 'src/stores'
import { PRESET } from 'src/stores/CardStore'

import banner from '../../static/Space Engineers - Red vs. Blue - IratusAvis.jpg'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        padding: '0.5em',
    },

    banner: {
        borderRadius: theme.spacing(1),
        display: 'block',
        height: theme.spacing(50),
        objectFit: 'cover',
        width: '100%',
    },
    content: {
        padding: '0.5em',
    },
    button: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(8),
    }
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const routerStore = React.useContext(CONTEXT.ROUTER)

    const [status, setStatus] = React.useState<typeof ASYNC_STATE[keyof typeof ASYNC_STATE]>(ASYNC_STATE.Idle)

    const getRandom = async () => {
        setStatus(ASYNC_STATE.Doing)
        try {
            const skip = Math.floor(Math.random() * 90000)  // Random blueprint out of first 90k blueprints.
            const res = await fetch(getApiUrl(PRESET.none, {}, undefined, 1, skip))
            const {docs} = await res.json() as {docs: [Required<IBlueprint>]}
            const doc = docs[0]
            routerStore.goBlueprint(doc._id)
        } catch(err) {
            setStatus(ASYNC_STATE.Error)
        }
    }

    return (
        <DefaultLayout>
            <Grid container spacing={2} justify='center' className={classes.root} style={{paddingBottom: 0}}>
                <Grid item xs={12} lg={9}>
                    <img src={banner} className={classes.banner} />
                </Grid>
            </Grid>
            <Grid container spacing={2} justify='center' className={classes.root}>
                <Grid item xs={12} sm={8} md={4} lg={3}>
                    <Paper className={classes.content}>
                        <Typography variant='h4' gutterBottom>1. Browse</Typography>
                        <Button
                            className={classes.button}
                            color='primary'
                            variant='contained'
                            onClick={() => routerStore.goView(ROUTES.BROWSE)}
                            fullWidth
                        >
                            <IconBrowse />
                            <Typography variant='button'>{'Browse'}</Typography>
                        </Button>
                        <Typography paragraph>
                            Browse all Steam workshop blueprints.
                        </Typography>
                        <Typography component='div' paragraph>
                            <ul>
                                <li><strong>Filters</strong>: vanilla-ness, blocks, PCU, required ores, etc.</li>
                                <li><strong>Text search</strong>: narrow down by title, author, etc.</li>
                                <li><strong>Sort</strong>: by subscribers, blocks, PCU, and required ore.</li>
                            </ul>
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={8} md={4} lg={3}>
                    <Paper className={classes.content}>
                        <Typography variant='h4' gutterBottom>2. Analyse</Typography>
                        <Button
                            className={classes.button}
                            color='primary'
                            variant='outlined'
                            onClick={getRandom}
                            fullWidth
                        >
                            <IconAnalyse />
                            <Typography variant='button'>{'Analyse Random'}</Typography>
                        </Button>
                        <Typography paragraph>
                            Get in-depth analysis of the blueprint.
                        </Typography>
                        <Typography component='div' paragraph>
                            <ul>
                                <li><strong>2D x-ray</strong>: Bad picture? View it in three projections.</li>
                                <li><strong>Costs</strong>: list all required components, ingots and ores.</li>
                                <li><strong>Stats</strong>: Precalculated values of most important stats.</li>
                            </ul>
                        </Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} sm={8} md={4} lg={3}>
                    <Paper className={classes.content}>
                        <Typography variant='h4' gutterBottom>3. Compare</Typography>
                        <Button
                            className={classes.button}
                            color='primary'
                            variant='outlined'
                            onClick={() => routerStore.goView(ROUTES.COMPARE)}
                            fullWidth
                        >
                            <IconCompare />
                            <Typography variant='button'>{'Compare'}</Typography>
                        </Button>
                        <Typography paragraph>
                            Compare blueprints side-to-side.
                        </Typography>
                        <Typography component='div' paragraph>
                            <ul>
                                <li><strong>Offline blueprints</strong>: Upload your own blueprint.</li>
                                <li><strong>Recent</strong>: Easy access to recently viewed blueprints.</li>
                                <li><strong>Unlimited</strong>: Compare as many blueprints as you can.</li>
                            </ul>
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>
        </DefaultLayout>
    )
})) /* ============================================================================================================= */
