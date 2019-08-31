import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Button, Grid } from '@material-ui/core'

import { ASYNC_STATE, createSmartFC, createStyles, IMyTheme, useAsyncEffectOnce } from '../../common/'
import { CONTEXT } from '../../stores'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        marginBottom: '1em',
        marginTop: '1em',
    },
})


interface IProps {
    add(): Promise<{
        count: number;
        limit: number;
        skip: number;
    }>
}


export default hot(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {
    const cardStore = React.useContext(CONTEXT.CARDS)
    const [state, setState] = React.useState<typeof ASYNC_STATE[keyof typeof ASYNC_STATE]>(ASYNC_STATE.Idle)

    useAsyncEffectOnce(async () => {
        try {
            setState(ASYNC_STATE.Doing)
            if(cardStore.cards.size === 0) {
                await cardStore.querry()
            }
            if(cardStore.cards.size === cardStore.count) {
                setState(ASYNC_STATE.Idle)
            } else {
                setState(ASYNC_STATE.Done)
            }
        } catch(err) {
            console.error(err)
            setState(ASYNC_STATE.Error)
        }
    })

    const myAdd = async () => {
        try {
            setState(ASYNC_STATE.Doing)
            const {count, limit, skip} = await props.add()
            if(cardStore.cards.size === cardStore.count) {
                setState(ASYNC_STATE.Idle)
            } else {
                setState(ASYNC_STATE.Done)
            }
        } catch(err) {
            console.error(err)
            setState(ASYNC_STATE.Error)
        }
    }

    const wrap = (content: JSX.Element) => (
        <Grid item xs={12} className={classes.root}>
            {content}
        </Grid>
    )

    if(cardStore.count === null) {
        return wrap((
            <Button fullWidth disabled variant='text'>
                {`Loading..`}
            </Button>
        ))
    }

    switch(state) {
        case(ASYNC_STATE.Idle): return wrap((
            <Button fullWidth disabled variant='text'>
                {`(${cardStore.cards.size}/${cardStore.count})`}
            </Button>
        ))
        case(ASYNC_STATE.Done): return wrap((
            <Button fullWidth onClick={myAdd} variant='text' color='primary'>
                {`(${cardStore.cards.size}/${cardStore.count}) Load more`}
            </Button>
        ))
        case(ASYNC_STATE.Doing): return wrap((
            <Button fullWidth disabled variant='text'>
                {`Loading next ${cardStore.cardsPerPage} blueprints..`}
            </Button>
        ))
        case(ASYNC_STATE.Error): return wrap((
            <Button fullWidth onClick={myAdd} variant='text'>
                {`Error. Retry?`}
            </Button>
        ))
        default: return null
    }
})) /* ============================================================================================================= */
