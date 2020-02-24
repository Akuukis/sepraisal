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
    index: number
}


export default hot(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {
    const cardStore = React.useContext(CONTEXT.CARDS)

    return (
        <Grid container justify='center' spacing={2} className={classes.root}>
            {[...cardStore.cards.values()]
                .map((card, i) => (
                    <Grid item className={classes.cardItem} key={card.id}>
                        <PageCard blueprint={card} index={props.index * 12 + i} />
                    </Grid>
                ))}
        </Grid>
    )
})) /* ============================================================================================================= */


// tslint:disable-next-line: naming-convention no-object-literal-type-assertion
export const PageState = {
    Idle: 0,

    Loading: 1,

    Loaded: 2,

    Failed: 3,
} as const
