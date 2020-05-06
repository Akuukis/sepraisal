import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { fade, Grid, lighten } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../../common/'
import CompareButton from '../../../components/CompareButton'
import FavoriteButton from '../../../components/FavoriteButton'
import IconAnalyse from '../../../components/icons/IconAnalyse'
import { CardStatus, ICard } from '../../../models/Card'
import { CONTEXT } from '../../../stores'
import OverlayItem from './OverlayItem'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        height: 165,
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
        cursor: 'pointer',
    },
    itemAnalysisOnHover: {
        '&:hover': {
            color: theme.palette.primary.main,
        },
    },
    itemFavorite: {
    },
    itemFavoriteOnHover: {
        // backgroundColor: fade(theme.palette.error.light, 0.9),
        '&:hover': {
            backgroundColor: fade(lighten(theme.palette.error.light, 0.33), 0.9),
        },
    },
    itemCompare: {
    },
    itemCompareOnHover: {
        color: theme.palette.text.secondary,
        // backgroundColor: fade(theme.palette.success.light, 0.9),
        '&:hover': {
            backgroundColor: fade(lighten(theme.palette.success.light, 0.33), 0.9),
        },
    },
    itemOff: {
        color: 'inherit',
    },
})


interface IProps {
    blueprint: ICard<CardStatus>
    index: number
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const routerStore = React.useContext(CONTEXT.ROUTER)
    const piwikStore = React.useContext(CONTEXT.PIWIK)
    const {blueprint: bp, index} = props

    const [hover, setHover] = React.useState(false)

    const setHoverOn = () => setHover(true)
    const setHoverOff = () => setHover(false)

    const goAnalysis = () => {
        piwikStore.push([
            'trackEvent',
            'browse',
            'click-analysis',
            bp.id,
            index,
        ])
        routerStore.goBlueprint(bp.id)
    }

    return (
        <Grid
            container
            className={classes.root}
            onMouseEnter={setHoverOn}
            onMouseLeave={setHoverOff}
        >
            <OverlayItem isHover={hover} onClick={goAnalysis} classes={{root: classes.itemAnalysis, rootOnHover: classes.itemAnalysisOnHover}}>
                <IconAnalyse fontSize='large' />
            </OverlayItem>
            <Grid container className={classes.subgroup} direction='column'>
                <OverlayItem isHover={hover} classes={{root: classes.itemFavorite, rootOnHover: classes.itemFavoriteOnHover}} alignItems='flex-start'>
                    <FavoriteButton bpId={bp.id} name={bp.steam!.title} classes={{off: classes.itemOff}} />
                </OverlayItem>
                <OverlayItem isHover={hover} classes={{root: classes.itemCompare, rootOnHover: classes.itemCompareOnHover}} alignItems='flex-end'>
                    <CompareButton id={bp.id} classes={{off: classes.itemOff}} />
                </OverlayItem>
            </Grid>
        </Grid>
    )
})) /* ============================================================================================================= */
