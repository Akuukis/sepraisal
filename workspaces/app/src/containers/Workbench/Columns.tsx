import { IBlueprint } from '@sepraisal/common'
import { IObservableArray } from 'mobx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../common/'
import { CONTEXT } from '../../stores'
import AnalysisColumn from '../Blueprint/Column'

const styles = (theme: IMyTheme) => createStyles({
    root: {
        flexWrap: 'nowrap',
        width: 'auto',
    },

    column: {
        minWidth: theme.spacing(1) * 1 + 536,
        width: theme.spacing(1) * 1 + 536,
    },
})


interface IProps {
}


export default hot(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {
    const blueprintStore = React.useContext(CONTEXT.BLUEPRINTS)
    const selectionStore = React.useContext(CONTEXT.SELECTION)

    const columns = [...selectionStore.selected]
        // tslint:disable-next-line: no-non-null-assertion
        .map<[string, IBlueprint]>((key) => [key, blueprintStore.uploads.has(key) ? blueprintStore.uploads.get(key)! : blueprintStore.recent.get(key)!])
        .map(([key, blueprint]) => (
            <AnalysisColumn
                width={12}
                classes={{root: classes.column}}
                key={key}
                bp={blueprint}
            />
    ))

    return (
        <Grid container spacing={2} justify='flex-start' className={classes.root}>
            {columns}
        </Grid>
    )
})) /* ============================================================================================================= */
