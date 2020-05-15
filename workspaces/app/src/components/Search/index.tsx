import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import { CONTEXT } from 'src/stores'

import Search from './Search'
import Sort from './Sort'
import Status from './Status'

const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    searchDisabledSort: {
        borderBottomRightRadius: theme.shape.borderRadius,
        borderTopRightRadius: theme.shape.borderRadius,
    },
})


interface IProps {
    disableStatus?: true
    disableSort?: true
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {disableStatus, disableSort} = props
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
            <Search className={disableSort && classes.searchDisabledSort} />
            {!disableSort && <Sort />}
            {!disableStatus && <Status />}
        </Grid>
    )
})) /* ============================================================================================================= */
