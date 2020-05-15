import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import { CONTEXT } from 'src/stores'

const styles = (theme: IMyTheme) => createStyles({
    root: {
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
        <Typography className={classes.root} variant='subtitle1' align='center'>
            {cardStore.count && `showing ${cardStore.cards.size} of ${cardStore.count} results`}
        </Typography>
    )
})) /* ============================================================================================================= */
