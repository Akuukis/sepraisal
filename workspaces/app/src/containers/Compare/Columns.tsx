import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../common'
import Analysis from '../../components/Analysis'
import { CONTEXT } from '../../stores'

const styles = (theme: IMyTheme) => createStyles({
    root: {
        position: 'relative',
    },

    column: {
        minWidth: theme.spacing(1) * 1 + 536,
        width: theme.spacing(1) * 1 + 536,
        position: 'absolute',
        transition: theme.transitions.create('left'),
    },
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const blueprintStore = React.useContext(CONTEXT.BLUEPRINTS)
    const selectionStore = React.useContext(CONTEXT.SELECTION)

    const columns = [...selectionStore.selected]
        // tslint:disable-next-line: no-non-null-assertion
        .map((id, i) => (
            <Analysis
                classes={{root: classes.column}}
                style={{left: i * (theme.spacing(1) * 1 + 536)}}
                key={id}
                bpId={id}
            />
    ))

    return (
        <div className={classes.root}>
            {columns}
        </div>
    )
})) /* ============================================================================================================= */
