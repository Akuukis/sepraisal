import { getApiUrl, IBlueprint } from '@sepraisal/common'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Button, Typography } from '@material-ui/core'

import { ASYNC_STATE, createSmartFC, createStyles, IMyTheme } from 'src/common'
import IconAnalyse from 'src/components/icons/IconAnalyse'
import { CONTEXT } from 'src/stores'
import { PRESET } from 'src/stores/CardStore'

import HomeCard from './HomeCard'


const styles = (theme: IMyTheme) => createStyles({
    root: {
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
        <HomeCard className={classes.root} heading='2. Analyse'>
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
        </HomeCard>
    )
})) /* ============================================================================================================= */
