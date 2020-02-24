import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Button, Card, Divider, Grid, Typography } from '@material-ui/core'
import IconSearch from '@material-ui/icons/Search'

import { createSmartFC, createStyles, IMyTheme, SE_COLORS } from '../../../common/'
import Steam from '../../../components/icons/Steam'
import { CardStatus, ICard } from '../../../models/Card'
import { CONTEXT } from '../../../stores'
import RowHeader from './RowHeader'
import RowPraisal from './RowPraisal'
import RowSteam from './RowSteam'
import Thumb from './Thumb'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        '&:hover $overlay': {
            opacity: 1,
        },
        'backgroundColor': SE_COLORS.white,
        'position': 'relative',
    },
    cardContent: {
        paddingBottom: theme.spacing(1),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingTop: theme.spacing(1),
    },
    overlay: {
        backgroundColor: `${SE_COLORS.grey}D0`,
        bottom: 0,
        height: '100%',
        left: 0,
        opacity: 0,
        position: 'absolute',
        right: 0,
        top: 0,
        transition: '.2s ease',
        width: '100%',
        zIndex: 9,
    },
    overlayItem: {
        '&:hover': {
            borderColor: SE_COLORS.black,
        },
        'borderColor': SE_COLORS.grey_dark,
        'borderStyle': `dashed`,
        'borderWidth': theme.spacing(1),
        'height': `calc(50% - ${theme.spacing(1)}px)`,
        'padding': theme.spacing(1),
        'width': `calc(100% - ${theme.spacing(1)}px)`,
    },
    overlayItem2: {
        cursor: 'pointer',
        height: `calc(100% - ${theme.spacing(1)}px)`,
        width: `calc(100% - ${theme.spacing(1)}px)`,
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

    const goAnalysis = () => {
        piwikStore.push([
            'trackEvent',
            'browse',
            'click-analysis',
            bp.id,
            index,
        ])
        routerStore.goBlueprint(bp.id, bp.steam?.revision)
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
        <Card className={classes.root}>
            <Thumb id={bp.id} thumb={bp.thumb} />
            <RowHeader id={bp.id} steam={bp.steam} />
            <Divider />
            <RowSteam classes={{root: classes.cardContent}} id={bp.id} steam={bp.steam} />
            <Divider />
            <RowPraisal classes={{root: classes.cardContent}} id={bp.id} sbc={bp.sbc} />
            <Grid container className={classes.overlay} direction='column' alignItems='center' justify='space-evenly'>
                <Grid item className={classes.overlayItem}>
                    <Grid
                        container
                        alignItems='center'
                        justify='center'
                        className={classes.overlayItem2}
                        onClick={goAnalysis}
                    >
                        <Grid item>
                            <Button size='large' disableRipple disableFocusRipple disableTouchRipple>
                                <IconSearch />
                                <Typography variant='button'>{'Analysis'}</Typography>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item className={classes.overlayItem}>
                    <Grid
                        container
                        alignItems='center'
                        justify='center'
                        className={classes.overlayItem2}
                        onClick={goSteam}
                    >
                        <Grid item>
                            <Button size='large' disableRipple disableFocusRipple disableTouchRipple>
                                <Steam />
                                <Typography variant='button'>{'Blueprint'}</Typography>
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Card>
    )
})) /* ============================================================================================================= */
