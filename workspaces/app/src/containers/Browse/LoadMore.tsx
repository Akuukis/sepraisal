import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Button, Grid } from '@material-ui/core'

import { ASYNC_STATE, createSmartFC, createStyles, IMyTheme } from 'src/common'
import { CONTEXT } from 'src/stores'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        padding: theme.spacing(6, 6),
    },

    button: {
        color: `${theme.palette.primary.contrastText} !important`,
        height: 64,
    },
    idle: {
    },
    doing: {
    },
    done: {
    },
    error: {
        backgroundColor: theme.palette.error.main,
        '&:hover': {
            backgroundColor: theme.palette.error.dark,
        },
    }
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const cardStore = React.useContext(CONTEXT.CARDS)

    const state = cardStore.cards.size === 0 ? ASYNC_STATE.Doing
        : cardStore.cards.size === -1 ? ASYNC_STATE.Error
        : cardStore.cards.size === cardStore.count ? ASYNC_STATE.Idle
        : ASYNC_STATE.Done


    const myAdd = async () => {
        await cardStore.nextPage()
    }

    const wrap = (content: JSX.Element) => (
        <Grid item xs={12} className={classes.root}>
            {content}
        </Grid>
    )

    if(cardStore.count === null) {
        return wrap((
            <Button fullWidth className={clsx(classes.button, classes.doing)} variant='text' disabled>
                {`Loading first ${cardStore.cardsPerPage} blueprints ...`}
            </Button>
        ))
    }

    switch(state) {
        case(ASYNC_STATE.Idle): return wrap((
            <Button fullWidth className={clsx(classes.button, classes.idle)} variant='text' disabled>
                {`${cardStore.cards.size}/${cardStore.count}`}
            </Button>
        ))
        case(ASYNC_STATE.Done): return wrap((
            <Button fullWidth className={clsx(classes.button, classes.done)} variant='outlined' onClick={myAdd} color='inherit'>
                {`(${cardStore.cards.size}/${cardStore.count}) Load more`}
            </Button>
        ))
        case(ASYNC_STATE.Doing): return wrap((
            <Button fullWidth className={clsx(classes.button, classes.doing)} variant='text' disabled>
                {`Loading next ${cardStore.cardsPerPage} blueprints ...`}
            </Button>
        ))
        case(ASYNC_STATE.Error): return wrap((
            <Button fullWidth className={clsx(classes.button, classes.error)} variant='outlined' onClick={myAdd}>
                {`Error. Retry?`}
            </Button>
        ))
        default: return null
    }
})) /* ============================================================================================================= */
