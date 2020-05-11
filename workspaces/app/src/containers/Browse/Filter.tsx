import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Divider } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import { CONTEXT } from 'src/stores'
import { ExclusiveScopeStore } from 'src/stores/ExclusiveScopeStore'

import FilterCustom from './FilterCustom'
import FilterPresets from './FilterPresets'
import FilterRaw from './FilterRaw'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        paddingBottom: theme.spacing(2),
        position: 'relative',
    },

    closeButton: {
        color: theme.palette.grey[500],
        left: theme.spacing(1),
        position: 'absolute',
        top: theme.spacing(1),
    },
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const [exclusiveScopeStore] = React.useState(() => new ExclusiveScopeStore)

    return (
        <div className={classes.root}>
            <CONTEXT.EXCLUSIVE_SCOPE.Provider value={exclusiveScopeStore}>
                <FilterPresets
                />
                <Divider />
                <FilterCustom
                />
                <Divider />
                <FilterRaw
                />
            </CONTEXT.EXCLUSIVE_SCOPE.Provider>
        </div>
    )
})) /* ============================================================================================================= */
