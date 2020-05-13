import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import { CONTEXT } from 'src/stores'

import Search from './Search'
import Sort from './Sort'

const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    input: {
        backgroundColor: 'white',
    },
    autocomplete: {
        minWidth: 360,
        maxWidth: 720,
        flexGrow: 1,
        flexShrink: 1,
    },
    status: {
        flexGrow: 0,
        flexShrink: 0,
        padding: theme.spacing(2),
        color: theme.palette.primary.contrastText,
        minWidth: 240,
    },
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const cardStore = React.useContext(CONTEXT.CARDS)

    return (
        <Grid
            className={classes.root}
            item
            xs={12}

            container
            justify='center'
            alignItems='center'
        >
            <Search />
            <Sort />
            <Typography className={classes.status} variant='subtitle1' align='center'>
                {cardStore.count && `showing ${cardStore.cards.size} of ${cardStore.count} results`}
            </Typography>
        </Grid>
    )
})) /* ============================================================================================================= */
