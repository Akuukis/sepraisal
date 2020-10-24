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
    const [state, setState] = React.useState<ASYNC_STATE>(ASYNC_STATE.Idle)


    const myAdd = async () => {
        try {
            setState(ASYNC_STATE.Doing)
            await cardStore.nextPage()
            setState(ASYNC_STATE.Done)
        } catch(err) {
            setState(ASYNC_STATE.Error)
        }
    }

    const wrap = (content: JSX.Element) => (
        <Grid item xs={12} className={classes.root}>
            {content}
        </Grid>
    )

    if(cardStore.count === -1 || state === ASYNC_STATE.Error) {
        return wrap((
            <Button fullWidth className={clsx(classes.button, classes.error)} variant='outlined' onClick={myAdd}>
                {`Error. Retry?`}
            </Button>
        ))
    }

    if(cardStore.cards.size === cardStore.count) {
        return wrap((
            <Button fullWidth className={clsx(classes.button, classes.idle)} variant='text' disabled>
                {`All ${cardStore.cards.size}/${cardStore.count} loaded.`}
            </Button>
        ))
    }

    if(cardStore.count === null) {
        return wrap((
            <Button fullWidth className={clsx(classes.button, classes.doing)} variant='text' disabled>
                {`Loading first ${cardStore.cardsPerPage} blueprints ...`}
            </Button>
        ))
    }

    if(state === ASYNC_STATE.Doing) {
        return wrap((
            <Button fullWidth className={clsx(classes.button, classes.doing)} variant='text' disabled>
                {`Loading next ${cardStore.cardsPerPage} blueprints ...`}
            </Button>
        ))
    }

    return wrap((
        <Button fullWidth className={clsx(classes.button, classes.done)} variant='outlined' onClick={myAdd} color='inherit'>
            {`Load more`}
        </Button>
    ))

})) /* ============================================================================================================= */
