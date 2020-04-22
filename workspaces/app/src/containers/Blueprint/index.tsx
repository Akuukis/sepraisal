import { API_URL, IBlueprint } from '@sepraisal/common'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme, useAsyncEffectOnce } from '../../common/'
import Analysis from '../../components/Analysis'
import { CONTEXT } from '../../stores'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        padding: '0.5em',
    },
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const maxWidth = 12
    const blueprintStore = React.useContext(CONTEXT.BLUEPRINTS)
    const routerStore = React.useContext(CONTEXT.ROUTER)
    const [status, setStatus] = React.useState<typeof STATUS[keyof typeof STATUS]>(STATUS.Idle)
    const [blueprint, setBlueprint] = React.useState<IBlueprint | null>(null)

    useAsyncEffectOnce(async () => {
        setStatus(STATUS.Loading)
        // tslint:disable-next-line: naming-convention
        const id = Number(routerStore.location.pathname.split('?')[0].split('/').pop() as string)
        console.log(routerStore.location.pathname.split('?')[0].split('/').pop(), id)
        const cached = blueprintStore.recent.get(id)
        if(cached) {
            setBlueprint(cached)
            setStatus(STATUS.Loaded)

            return
        }

        try {
            const find = encodeURIComponent(JSON.stringify({_id: id}))
            const res = await fetch(`${API_URL}?find=${find}&limit=${1}`)
            const {docs} = await res.json() as {docs: Array<Required<IBlueprint>>}
            const doc = docs.pop()
            if(!doc) {
                setStatus(STATUS.Failed)
            } else {
                blueprintStore.setRecent(doc)
                setBlueprint(doc)
                setStatus(STATUS.Loaded)
            }
        } catch(err) {
            setStatus(STATUS.Failed)
        }
    })

    if(status !== STATUS.Loaded || !blueprint) {
        return <Typography variant='body1'>TODO: nice loading animation..</Typography>
    }

    return (
        <Grid container spacing={2} justify='center' style={{padding: '8px'}}>
            <Analysis bp={blueprint}/>
        </Grid>
    )
})) /* ============================================================================================================= */

// tslint:disable-next-line: naming-convention no-object-literal-type-assertion
export const STATUS = {
    Idle: 0,

    Loading: 1,

    Loaded: 2,

    Failed: 3,
} as const
