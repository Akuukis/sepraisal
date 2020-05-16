import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import { CONTEXT } from 'src/stores'

import Card from './Card'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        minWidth: `calc(${theme.shape.boxWidth}px + ${theme.spacing(0.5) * 2}px)`,
    },

    card: {
        margin: theme.spacing(2),
    },
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const cardStore = React.useContext(CONTEXT.CARDS)

    return (
        <Grid item xs={12} container justify='center' className={classes.root}>
            {[...cardStore.cards.values()]
                .map((card, i) => (
                    <Card classes={{root: classes.card}} blueprint={card} key={card.id} index={i} />
                ))}
        </Grid>
    )
})) /* ============================================================================================================= */
