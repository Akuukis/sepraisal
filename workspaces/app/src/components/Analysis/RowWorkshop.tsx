import { IBlueprint } from '@sepraisal/common'
import * as moment from 'moment'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Button, Card, CardContent, CardMedia, Divider, Grid, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, formatDecimal, GridSize, IMyTheme, linkBp } from '../../common/'
import Steam from '../../components/icons/Steam'
import ValueWithLabel from '../../components/ValueWithLabel'
import MyRow from '../MyRow'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        padding: '0.5em',
    },

    card: {
    },
    cardContent: {
        paddingBottom: 8,
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingTop: 8,
    },
    cell: {
        width: '268px',
    },
    corner: {
        backgroundColor: theme.palette.secondary.main,
    },
    inline: {
        display: 'inline',
    },
})


interface IProps {
    bp: IBpProjectionRow
    width: GridSize
}


export default hot(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {
    const {bp} = props


    const starsValue = bp.steam.ratingStars === null ? '-' : `${'★'.repeat(bp.steam.ratingStars)}${'☆'.repeat(5 - bp.steam.ratingStars)}`
    const starsDef = bp.steam.ratingStars === null ? 'few ratings' : `${bp.steam.ratingCount}`

    return (
        <Grid item xs={props.width}>
            <Card square className={classes.card}>
                <Grid container>
                    <Grid item xs={12} sm={6} className={classes.cell}>
                        <Grid container spacing={0}>
                            <Grid item xs={12} sm={6} className={classes.corner}>
                                <CardContent className={classes.cardContent}>
                                    <Typography variant='body1'>{`WORKSHOP`}</Typography>
                                </CardContent>
                                <Divider />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Button size='medium' disableRipple disableFocusRipple disableTouchRipple href={linkBp(bp.steam.id)} target='_blank' rel='noreferrer noopener'>
                                    <Steam />
                                    <Typography variant='body1'>{'Subscribe'}</Typography>
                                </Button>
                                <Divider />
                            </Grid>
                        </Grid>
                        <MyRow>
                            <ValueWithLabel label={`subscribers`} value={formatDecimal(bp.steam.subscriberCount)} />
                            <ValueWithLabel label={starsDef} value={starsValue} />
                            <ValueWithLabel label={`views`} value={formatDecimal(bp.steam.visitorCount)} />
                            <ValueWithLabel label={`comments`} value={formatDecimal(bp.steam.commentCount)} />
                        </MyRow>
                        <MyRow>
                            <ValueWithLabel label={'posted'} value={moment(bp.steam.postedDate).format('YYYY-MM')} />
                            <ValueWithLabel label={'updated'} value={moment(bp.steam.updatedDate).format('YYYY-MM')} />
                            <ValueWithLabel label={`collection`} value={(bp.steam.collections.length > 0 ? bp.steam.collections[0] : {title: '-'}).title} xs={6} />
                        </MyRow>
                    </Grid>
                    <Grid item xs={12} sm={6} className={classes.cell}>
                        <CardMedia
                            style={{paddingTop: '56.3444%'}}
                            image={bp.thumb.webp ? `data:image/png;base64,${bp.thumb.webp.toString('base64')}` : 'https://via.placeholder.com/268x151?text=No+Image'}
                            title={bp.steam.title}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} className={classes.cell} style={{overflowY: 'scroll', height: `${151 * 2}px`}}>
                        <CardContent className={classes.cardContent}>
                            <Typography variant='body1' dangerouslySetInnerHTML={{ __html: bp.steam.description}} />
                        </CardContent>
                    </Grid>
                </Grid>
            </Card>
        </Grid>
    )
})) /* ============================================================================================================= */


type ProjectionCardSteam =
    | 'author'
    | 'collections'
    | 'commentCount'
    | 'description'
    | 'id'
    | 'popularity'
    | 'postedDate'
    | 'ratingStars'
    | 'ratingCount'
    | 'subscriberCount'
    | 'title'
    | 'updatedDate'
    | 'visitorCount'

type ProjectionCardThumb =
    | 'webp'

interface IBpProjectionRow {
    steam: {[key in keyof Pick<IBlueprint.ISteam, ProjectionCardSteam>]: IBlueprint.ISteam[key]}
    thumb: {[key in keyof Pick<IBlueprint.IThumb, ProjectionCardThumb>]: IBlueprint.IThumb[key]},
}
