import { getApiUrl, IBlueprint } from '@sepraisal/common'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid } from '@material-ui/core'

import { ASYNC_STATE, createSmartFC, createStyles, IMyTheme } from 'src/common'
import DefaultLayout from 'src/layouts/DefaultLayout'
import { CONTEXT } from 'src/stores'
import { PRESET } from 'src/stores/CardStore'

import banner from '../../../static/Space Engineers - Red vs. Blue - IratusAvis.jpg'
import Analyse from './Analyse'
import Browse from './Browse'
import Compare from './Compare'


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
                    <Browse />
               </Grid>
                <Grid item xs={12} sm={8} md={4} lg={3}>
                    <Analyse />
                </Grid>
                <Grid item xs={12} sm={8} md={4} lg={3}>
                    <Compare />
                </Grid>
            </Grid>
        </DefaultLayout>
    )
})) /* ============================================================================================================= */
