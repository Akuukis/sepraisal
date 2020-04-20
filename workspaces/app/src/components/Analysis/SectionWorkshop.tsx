import { IBlueprint } from '@sepraisal/common'
import * as moment from 'moment'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Button, CardMedia, Grid, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, formatDecimal, GridSize, IMyTheme, linkBp } from '../../common/'
import Steam from '../../components/icons/Steam'
import ValueCell from '../../components/Cell/ValueCell'
import MyRow from '../MyRow'
import HeaderCell from '../Cell/HeaderCell'
import CenterCell from '../Cell/CenterCell'
import MyBox from '../MyBox'
import MySection from '../MySection'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    thumb: {
        paddingTop: '56.3444%',  // = 268 / 151
        width: '100%',
        borderTopRightRadius: `${theme.spacing(1)}px`,
    },

    description: {
        paddingBottom: theme.spacing(2),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingTop: theme.spacing(2),
        backgroundColor: theme.palette.primary.light,
        '& > img': {
            maxWidth: `calc(${268 * 2}px - ${theme.spacing(4)}px)`,
        },
        height: `calc(${151 * 2}px - ${theme.spacing(4)}px)`,
        overflowX: 'hidden',
        overflowY: 'scroll',
        borderBottomLeftRadius: `${theme.spacing(1)}px`,
        borderBottomRightRadius: `${theme.spacing(1)}px`,
    },
})


interface IProps {
    bp: IBpProjectionRow
    width: GridSize
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {bp} = props


    const starsValue = bp.steam.ratingStars === null ? '-' : `${'★'.repeat(bp.steam.ratingStars)}${'☆'.repeat(5 - bp.steam.ratingStars)}`
    const starsDef = bp.steam.ratingStars === null ? 'few ratings' : `${bp.steam.ratingCount}`

    return (
        <MySection className={classes.root}>
            <MyBox>
                <MyRow>
                    <HeaderCell title='WORKSHOP' xs={12} sm={6} />
                    <CenterCell wide>
                        <Button href={linkBp(bp.steam.id)} target='_blank' rel='noreferrer noopener'>
                            <Steam />
                            <Typography variant='body1'>{'Subscribe'}</Typography>
                        </Button>
                    </CenterCell>
                </MyRow>
                <MyRow>
                    <ValueCell label={`subscribers`} value={formatDecimal(bp.steam.subscriberCount)} />
                    <ValueCell label={starsDef} value={starsValue} />
                    <ValueCell label={`views`} value={formatDecimal(bp.steam.visitorCount)} />
                    <ValueCell label={`comments`} value={formatDecimal(bp.steam.commentCount)} />
                </MyRow>
                <MyRow>
                    <ValueCell label={'posted'} value={moment(bp.steam.postedDate).format('YYYY-MM')} />
                    <ValueCell label={'updated'} value={moment(bp.steam.updatedDate).format('YYYY-MM')} />
                    <ValueCell wide label={`collection`} value={(bp.steam.collections.length > 0 ? bp.steam.collections[0] : {title: '-'}).title}/>
                </MyRow>
            </MyBox>
            <MyBox>
                <CardMedia
                    className={classes.thumb}
                    image={bp.thumb.webp ? `data:image/png;base64,${bp.thumb.webp.toString('base64')}` : 'https://via.placeholder.com/268x151?text=No+Image'}
                    title={bp.steam.title}
                />
            </MyBox>
            <MyBox wide>
                <Typography className={classes.description} variant='body1' dangerouslySetInnerHTML={{ __html: bp.steam.description}} />
            </MyBox>
        </MySection>
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
