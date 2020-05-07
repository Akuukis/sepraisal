import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../common'
import Analysis from '../../components/Analysis'
import { CONTEXT } from '../../stores'

const styles = (theme: IMyTheme) => createStyles({
    root: {
        flexWrap: 'nowrap',
    },

    column: {
        display: 'inline-block',
        position: 'relative',
        transition: theme.transitions.create('left'),
    },
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const selectionStore = React.useContext(CONTEXT.SELECTION)
    const width = selectionStore.narrow ? 0.5 : 1

    const columns = [...selectionStore.selected]
        .map((id, i) => (
            <Analysis
                classes={{root: classes.column}}
                // style={{left: i * (theme.spacing(1) + width * 2 * theme.shape.boxWidth)}}
                key={id}
                bpId={id}
                maxWidth={width}
            />
    ))

    return (
        <Grid container className={classes.root}>
            {columns}
        </Grid>
    )
})) /* ============================================================================================================= */
