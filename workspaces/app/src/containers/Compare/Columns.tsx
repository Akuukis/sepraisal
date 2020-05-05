import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { createSmartFC, createStyles, IMyTheme } from '../../common'
import Analysis from '../../components/Analysis'
import { CONTEXT } from '../../stores'

const styles = (theme: IMyTheme) => createStyles({
    root: {
        position: 'relative',
    },

    column: {
        position: 'absolute',
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
                style={{left: i * (theme.spacing(1) * 1 + width * 536)}}
                key={id}
                bpId={id}
                maxWidth={width}
            />
    ))

    return (
        <div className={classes.root}>
            {columns}
        </div>
    )
})) /* ============================================================================================================= */
