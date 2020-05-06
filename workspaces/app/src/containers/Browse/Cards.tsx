import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../common/'
import { CONTEXT } from '../../stores'
import PageCard from './Card'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        // marginBottom: '1em',
    },

    cardItem: {
        maxWidth: '300px',
        width: '100%',
    },
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const cardStore = React.useContext(CONTEXT.CARDS)

    return (
        <Grid item xs={12} container justify='center' spacing={2} className={classes.root}>
            {[...cardStore.cards.values()]
                .map((card, i) => (
                    <Grid item className={classes.cardItem} key={card.id}>
                        <PageCard blueprint={card} index={i} />
                    </Grid>
                ))}
        </Grid>
    )
})) /* ============================================================================================================= */
