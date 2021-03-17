import { IBlueprint } from '@sepraisal/common'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Button, Typography } from '@material-ui/core'

import { ASYNC_STATE, createSmartFC, createStyles, getApiUrl, IMyTheme } from 'src/common'
import IconCompare from 'src/components/icons/IconCompare'
import { PROVIDER, ROUTE } from 'src/constants'
import { PRESET } from 'src/models'
import { CONTEXT } from 'src/stores'

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
            const skip = Math.floor(Math.random() * 1000)  // Random fighter.
            const res = await fetch(getApiUrl(PRESET.fighter, {limit: 2, skip}))
            const {docs} = await res.json() as {docs: [Required<IBlueprint>, Required<IBlueprint>]}
            const searchParams = new URLSearchParams()
            searchParams.append(PROVIDER.STEAM, String(docs[0]._id))
            searchParams.append(PROVIDER.STEAM, String(docs[1]._id))
            routerStore.goLocation({pathname: ROUTE.COMPARE, search: searchParams.toString()})
        } catch(err) {
            setStatus(ASYNC_STATE.Error)
        }
    }

    let title: React.ReactNode
    switch(status) {
        case(ASYNC_STATE.Idle): {
            title = 'Compare Two Fighters'
            break
        }
        case(ASYNC_STATE.Doing): {
            title = 'Randomizing ...'
            break
        }
        case(ASYNC_STATE.Done):
        case(ASYNC_STATE.Error):
        default: {
            throw new Error('catch me')
        }
    }


    return (
        <HomeCard className={classes.root} Icon={IconCompare} heading='Compare'>
            <Typography align='center' variant='h3'>
                Compare blueprints side-to-side.
            </Typography>
            <Typography component='div' paragraph>
                <ul>
                    <li><strong>Offline blueprints</strong>: Upload your own blueprint.</li>
                    <li><strong>Recent</strong>: Easy access to recently viewed blueprints.</li>
                    <li><strong>Unlimited</strong>: Compare as many blueprints as you can.</li>
                </ul>
            </Typography>
            <Button
                className={classes.button}
                color='primary'
                variant='outlined'
                onClick={getRandom}
                fullWidth
                disabled={status !== ASYNC_STATE.Idle}
            >
                <Typography variant='button'>{title}</Typography>
            </Button>
        </HomeCard>
    )
})) /* ============================================================================================================= */
