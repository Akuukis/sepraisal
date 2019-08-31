import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Avatar, Button, Card, CardContent, CardHeader, CardMedia, Divider, Grid, Typography } from '@material-ui/core'
import IconSearch from '@material-ui/icons/Search'

import { createSmartFC, createStyles, formatDecimal, IMyTheme, padTo2, SE_COLORS } from '../../common/'
import Steam from '../../components/icons/Steam'
import KeyValueBox from '../../components/KeyValueBox'
import { CardStatus, ICard } from '../../models/Card'
import { CONTEXT } from '../../stores'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        '&:hover $overlay': {
            opacity: 1,
        },
        backgroundColor: SE_COLORS.white,
        position: 'relative',
    },

    badgeError: {
        color: theme.palette.error.main,
    },
    badgeGood: {
        color: '#0B5',
    },
    badgeNumber: {
        background: '#FFFF',
        color: '#000',
    },
    badgeRoot: {
        background: '#0000',
    },
    badgeWarning: {
        color: '#CA0',
    },
    cardContent: {
        paddingBottom: theme.spacing(1),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingTop: theme.spacing(1),
    },
    cardHeader: {
        paddingBottom: theme.spacing(2),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingTop: theme.spacing(2),
    },
    cardHeaderContent: {
        minWidth: '0px',  // Shrink if name too long.
    },
    icon: {},
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
        borderColor: SE_COLORS.grey_dark,
        borderStyle: `dashed`,
        borderWidth: theme.spacing(1),
        height: `calc(50% - ${theme.spacing(1)}px)`,
        padding: theme.spacing(1),
        width: `calc(100% - ${theme.spacing(1)}px)`,
    },
    overlayItem2: {
        cursor: 'pointer',
        height: `calc(100% - ${theme.spacing(1)}px)`,
        width: `calc(100% - ${theme.spacing(1)}px)`,
    },
    primary: {},
})


interface IProps {
    blueprint: ICard<CardStatus.ok>
}


export default hot(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {
    const routerStore = React.useContext(CONTEXT.ROUTER)
    const {blueprint: bp} = props

    const postedDate = `${bp.steam.postedDate.getUTCFullYear()}-${padTo2(bp.steam.postedDate.getMonth() + 1)}`
    const starsValue = bp.steam.ratingStars === null ? '-' : `${'★'.repeat(bp.steam.ratingStars)}${'☆'.repeat(5 - bp.steam.ratingStars)}`
    const starsDef = bp.steam.ratingStars === null ? 'few ratings' : `${bp.steam.ratingCount}`

    return (
        <Card className={classes.root}>
            <CardMedia
                style={{paddingTop: '56.25%'}}
                image={bp.thumb.webp !== null ? `data:image/webp;base64,${bp.thumb.webp.toString('base64')}` : 'https://via.placeholder.com/268x151?text=No+Image'}
                title={bp.steam.title}
            />
            <CardHeader
                titleTypographyProps={{noWrap: true, style: {lineHeight: '1.429em'}}}
                subheaderTypographyProps={{noWrap: true, style: {lineHeight: '1.429em'}}}
                classes={{root: classes.cardHeader, content: classes.cardHeaderContent}}
                avatar={<Avatar>{bp.steam.author.title.slice(0, 2)}</Avatar>}
                title={bp.steam.title}
                subheader={(bp.steam.collections.length > 0 ? bp.steam.collections[0] : {title: '-'}).title}
            />
            <Divider />
            <CardContent className={classes.cardContent}>
                <Grid container spacing={0} alignItems='center'>
                    <KeyValueBox def='subscribers' value={formatDecimal(bp.steam.subscriberCount)} />
                    <KeyValueBox def='posted' value={postedDate} />
                    <KeyValueBox def={starsDef} value={starsValue} />
                    <KeyValueBox def='author' value={bp.steam.author.title} />
                </Grid>
            </CardContent>
            <Divider />
            <CardContent className={classes.cardContent}>
                <Grid container spacing={0}>
                    <KeyValueBox def={`PCU`} value={formatDecimal(bp.sbc.blockPCU)} />
                    <KeyValueBox def={`${bp.sbc.gridSize.slice(0, 1)}-blocks`} value={formatDecimal(bp.sbc.blockCount)} />
                    <KeyValueBox def={`ore (m\u00B3)`} value={formatDecimal(bp.sbc.oreVolume / 1000)} />
                    <KeyValueBox def={`workhours`} value={formatDecimal((bp.sbc.blockTime + bp.sbc.componentTime + bp.sbc.ingotTime) / 60 / 60, 1)} />
                </Grid>
            </CardContent>
            <Grid container className={classes.overlay} direction='column' alignItems='center' justify='space-evenly'>
                <Grid item className={classes.overlayItem}>
                    <Grid
                        container
                        alignItems='center'
                        justify='center'
                        className={classes.overlayItem2}
                        onClick={() => routerStore.goBlueprint(bp.steam.id, bp.steam.revision)}
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
                        onClick={() => window.open(`https://steamcommunity.com/sharedfiles/filedetails/?id=${bp.id}`)}
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
