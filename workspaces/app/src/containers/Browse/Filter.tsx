import clipboard from 'clipboard-polyfill'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Button, Divider, Grid } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import IconClearAll from 'src/components/icons/IconClearAll'
import IconClipboard from 'src/components/icons/IconClipboard'
import { BROWSE_PARTS } from 'src/constants'
import { PRESET, QueryFindBuilder } from 'src/models'
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
    const routerStore = React.useContext(CONTEXT.ROUTER)

    // Once, try to load filter query.
    React.useEffect(() => {
        const searchParams = new URLSearchParams(location.search)

        const sort = searchParams.get(BROWSE_PARTS.SORT)
        if(sort) cardStore.sort = JSON.parse(sort)

        const filter = searchParams.get(BROWSE_PARTS.FILTER)
        if(filter) cardStore.querryFindBuilder.replaceQueries(JSON.parse(filter))

        if(sort || filter) {
            searchParams.delete(BROWSE_PARTS.SORT)
            searchParams.delete(BROWSE_PARTS.FILTER)
            routerStore.replace({...location, search: searchParams.toString()})
        }
    }, [])

    const copy = () => {
        const partialQueryBuilder = new QueryFindBuilder()
        partialQueryBuilder.replaceQueries(cardStore.querryFindBuilder.find.$and)
        partialQueryBuilder.setCriterion('steam.author.title', null)  // Already in url.
        partialQueryBuilder.setCriterion('steam.collections.title', null)  // Already in url.

        const searchParams = new URLSearchParams(location.search)
        searchParams.set(BROWSE_PARTS.FILTER, JSON.stringify(partialQueryBuilder.find.$and))
        searchParams.set(BROWSE_PARTS.SORT, JSON.stringify(cardStore.sort))
        const url = `${location.origin}${location.pathname}?${searchParams.toString()}`
        clipboard.writeText(url)
    }

    const reset = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        cardStore.querryFindBuilder.replaceQueries(PRESET.none)
    }

    return (
        <div className={classes.root}>
            <CONTEXT.EXCLUSIVE_SCOPE.Provider value={exclusiveScopeStore}>
                <Grid container justify='space-between'>
                    <Button
                        className={classes.clearButton}
                        variant='outlined'
                        color='primary'
                        size='small'
                        onClick={copy}
                    >
                        <IconClipboard />
                        URL with Filters
                    </Button>
                    <Button
                        className={classes.clearButton}
                        variant='outlined'
                        color='primary'
                        size='small'
                        onClick={reset}
                    >
                        <IconClearAll />
                        Clear filters
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
