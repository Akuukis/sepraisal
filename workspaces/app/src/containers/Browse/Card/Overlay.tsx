import clsx from 'clsx'
import { action } from 'mobx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { fade, Grid, lighten } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme, THUMB_HEIGHT, THUMB_WIDTH } from '../../../common/'
import IconAnalyse from '../../../components/icons/IconAnalyse'
import IconCompare from '../../../components/icons/IconCompare'
import IconFavorite from '../../../components/icons/IconFavorite'
import { CardStatus, ICard } from '../../../models/Card'
import { CONTEXT } from '../../../stores'
import OverlayItem from './OverlayItem'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        height: `calc(${theme.shape.boxWidth}/${THUMB_WIDTH} * ${THUMB_HEIGHT}px)`,
        left: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        transition: '.2s ease',
        zIndex: 9,
    },

    subgroup: {
        flex: 1,
        overflow: 'hidden',
    },

    itemAnalysis: {
        flex: 5,
    },
    itemAnalysisOnHover: {
        '&:hover': {
            color: theme.palette.primary.main,
        },
    },
    itemFavorite: {
        paddingTop: theme.spacing(2),  // Because heart is only default size.
    },
    itemFavoriteEnabled: {
        color: theme.palette.error.main,
    },
    itemFavoriteOnHover: {
        // backgroundColor: fade(theme.palette.error.light, 0.9),
        '&:hover': {
            backgroundColor: fade(lighten(theme.palette.error.light, 0.33), 0.9),
        },
    },
    itemCompare: {
    },
    itemCompareEnabled: {
        color: theme.palette.success.main,
    },
    itemCompareOnHover: {
        // backgroundColor: fade(theme.palette.success.light, 0.9),
        '&:hover': {
            backgroundColor: fade(lighten(theme.palette.success.light, 0.33), 0.9),
        },
    },
    itemOff: {
        color: theme.palette.success.main,
    },
})


interface IProps {
    blueprint: ICard<CardStatus>
    index: number
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const routerStore = React.useContext(CONTEXT.ROUTER)
    const piwikStore = React.useContext(CONTEXT.PIWIK)
    const {blueprint, index} = props
    const {id, steam} = blueprint

    const [hover, setHover] = React.useState(false)

    const setHoverOn = () => setHover(true)
    const setHoverOff = () => setHover(false)

    const goAnalysis = () => {
        piwikStore.push([
            'trackEvent',
            'browse',
            'click-analysis',
            id,
            index,
        ])
        routerStore.goBlueprint(id)
    }

    // Copied from CompareButton
    const selectionStore = React.useContext(CONTEXT.SELECTION)
    const compared = selectionStore.selected.includes(id)
    const handleCompareToggle = action(`CardOverlay<${JSON.stringify(id)}>`, () => {
        if(compared) {
            selectionStore.selected.remove(id)
        } else {
            selectionStore.selected.push(id)
        }
    })

    // Copied from FavoriteButton
    const favoriteStore = React.useContext(CONTEXT.FAVORITES)
    const favorited = favoriteStore.has(id)
    const handleFavoriteToggle = action(`FavoriteButton<${JSON.stringify(id)}>`, () => {
        if(favorited) {
            favoriteStore.shift(id)
        } else {
            favoriteStore.push({id, name: steam!.title})
        }
    })

    return (
        <Grid
            container
            className={classes.root}
            onMouseEnter={setHoverOn}
            onMouseLeave={setHoverOff}
        >
            <OverlayItem
                classes={{root: classes.itemAnalysis, rootOnHover: classes.itemAnalysisOnHover}}
                isHover={hover}
                onClick={goAnalysis}
            >
                <IconAnalyse fontSize='large' />
            </OverlayItem>
            <Grid container className={classes.subgroup} direction='column'>
                <OverlayItem
                    isHover={hover}
                    classes={{
                        root: clsx(classes.itemFavorite, favorited && classes.itemFavoriteEnabled),
                        rootOnHover: clsx(classes.itemFavoriteOnHover, favorited && classes.itemFavoriteEnabled),
                    }}
                    alignItems='flex-start'
                    onClick={handleFavoriteToggle}
                >
                    <IconFavorite fontSize='default' />
                </OverlayItem>
                <OverlayItem
                    isHover={hover}
                    classes={{
                        root: clsx(classes.itemCompare, compared && classes.itemCompareEnabled),
                        rootOnHover: clsx(classes.itemCompareOnHover, compared && classes.itemCompareEnabled),
                    }}
                    alignItems='flex-end'
                    onClick={handleCompareToggle}
                >
                    <IconCompare fontSize='large' />
                </OverlayItem>
            </Grid>
        </Grid>
    )
})) /* ============================================================================================================= */
