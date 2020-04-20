import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid, Typography } from '@material-ui/core'
import IconSearch from '@material-ui/icons/Search'

import { createSmartFC, createStyles, IMyTheme, SE_COLORS } from '../../../common/'
import { CardStatus, ICard } from '../../../models/Card'
import { CONTEXT } from '../../../stores'
import OverlayItem from './OverlayItem'
import FavoriteButton from '../../../components/FavoriteButton'
import Steam from '../../../components/icons/Steam'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        '&:hover': {
            backgroundColor: `${SE_COLORS.grey}80`,
        },
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
        cursor: 'pointer',
        flex: 6,
    },

    itemFavorite: {
        borderColor: `#0000`,
        '&:hover': {
            borderColor: `#0000`,
        },
    },

    itemCompare: {
        borderColor: `#0000`,
        color: `${theme.palette.primary.main}80`,
        '&:hover': {
            borderColor: `#0000`,
            color: theme.palette.primary.main,
        },
    },

    itemSubscribe: {
        cursor: 'pointer',
        borderWidth: theme.spacing(0.5),
        color: theme.palette.text.disabled,
        '&:hover': {
            color: theme.palette.text.primary,
        },
    },

})


interface IProps {
    blueprint: ICard<CardStatus>
    index: number
}


export default hot(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {
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

    const goSteam = () => {
        piwikStore.push([
            'trackEvent',
            'browse',
            'click-steam',
            bp.id,
            index,
        ])
        window.open(`https://steamcommunity.com/sharedfiles/filedetails/?id=${bp.id}`)
    }

    return (
        <Grid
            container
            className={classes.root}
            onMouseEnter={setHoverOn}
            onMouseLeave={setHoverOff}
        >
            <OverlayItem isHover={hover} onClick={goAnalysis} classes={{root: classes.itemAnalysis}}>
                <IconSearch />
                <Typography variant='button'>{'Analysis'}</Typography>
            </OverlayItem>
            <Grid container className={classes.subgroup} direction='column'>
                <OverlayItem isHover={hover} classes={{containerOnHover: classes.itemFavorite}}>
                    <FavoriteButton id={bp.id} />
                </OverlayItem>
                <OverlayItem isHover={hover} classes={{containerOnHover: classes.itemCompare}}>
                    <IconSearch />
                </OverlayItem>
                <OverlayItem isHover={hover} onClick={goSteam} classes={{containerOnHover: classes.itemSubscribe}}>
                    <Steam />
                </OverlayItem>
            </Grid>
        </Grid>
    )
})) /* ============================================================================================================= */
