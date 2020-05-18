import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Button, Divider, Grid } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import IconClearAll from 'src/components/icons/IconClearAll'
import { PRESET } from 'src/models'
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
    clearButton: {
        margin: theme.spacing(2),
    },
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const [exclusiveScopeStore] = React.useState(() => new ExclusiveScopeStore)
    const cardStore = React.useContext(CONTEXT.CARDS)

    const reset = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        cardStore.querryFindBuilder.setFilter(PRESET.none)
    }

    return (
        <div className={classes.root}>
            <CONTEXT.EXCLUSIVE_SCOPE.Provider value={exclusiveScopeStore}>
                <Grid container justify='flex-end'>
                    <Button
                        className={classes.clearButton}
                        variant='outlined'
                        color='primary'
                        size='small'
                        onClick={reset}
                    >
                        <IconClearAll />
                        Clear all filters
                    </Button>
                </Grid>
                <FilterPresets/>
                <Divider />
                <FilterCustom/>
                <Divider />
                <FilterRaw/>
            </CONTEXT.EXCLUSIVE_SCOPE.Provider>
        </div>
    )
})) /* ============================================================================================================= */
