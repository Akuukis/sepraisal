import { IBlueprint } from '@sepraisal/common'
import moment from 'moment'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Link, Typography } from '@material-ui/core'

import {
    createSmartFC,
    createStyles,
    formatDecimal,
    IMyTheme,
    linkAuthor,
    linkCollection,
    STEAM_COLORS,
} from '../../common/'
import ValueCell from '../../components/Cell/ValueCell'
import CenterCell from '../Cell/CenterCell'
import MyBox from '../MyBox'
import MyBoxColumn from '../MyBoxColumn'
import MyBoxRow from '../MyBoxRow'
import MySectionInner from './MySectionInner'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    img: {
        width: '100%',
        height: '100%',
        objectFit: 'fill',
    },

    description: {
        paddingBottom: theme.spacing(2),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingTop: theme.spacing(2),
        color: STEAM_COLORS.white,
        backgroundColor: STEAM_COLORS.blue,
        '& > img': {
            maxWidth: `calc(100% - ${theme.spacing(4)}px)`,
        },
        height: `100%`,
        width: `100%`,
        overflowX: 'hidden',
        overflowY: 'scroll',
    },
})


interface IProps {
    bp: IBpProjectionRow
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {bp} = props


    const starsValue = bp.steam.ratingStars === null ? '-' : `${'★'.repeat(bp.steam.ratingStars)}${'☆'.repeat(5 - bp.steam.ratingStars)}`
    const starsDef = bp.steam.ratingStars === null ? 'few ratings' : `${bp.steam.ratingCount}`
    const collections = bp.steam.collections.map((collection, i) => (
        (<Link key={i} href={linkCollection(collection.id)} target='_blank' rel='noreferrer noopener' variant='body2' noWrap>
            {collection.title ?? collection.id}
        </Link>)
    ))
    const author = (<Link href={linkAuthor(bp.steam.author.id)} target='_blank' rel='noreferrer noopener' variant='body1'>
            {bp.steam.author.title ?? bp.steam.author.id}
        </Link>)

    return (
        <MySectionInner
            heading='Workshop'
            label='subscribers'
            value={formatDecimal(bp.steam.subscriberCount)}
            MyBoxColumnProps={{height: 3}}
            innerChildren={(<>
                <MyBoxRow width={3}>
                    <MyBox width={3}>
                        <ValueCell label={`author`} value={author}/>
                        {/* <CenterCell width={1.5}>
                            <Button href={linkBp(bp.steam.id)} target='_blank' rel='noreferrer noopener'>
                                <Steam />
                                <Typography variant='body1'>{'Subscribe'}</Typography>
                            </Button>
                        </CenterCell> */}
                        <ValueCell label={starsDef} value={starsValue} />
                        <ValueCell label={`views`} value={formatDecimal(bp.steam.visitorCount)} />
                    </MyBox>
                </MyBoxRow>
                <MyBoxRow width={3}>
                    <MyBox width={3}>
                        <ValueCell label={`comments`} value={formatDecimal(bp.steam.commentCount)} />
                        <ValueCell label={'posted'} value={moment(bp.steam.postedDate).format('YYYY-MM')} />
                        <ValueCell label={'updated'} value={moment(bp.steam.updatedDate).format('YYYY-MM')} />
                    </MyBox>
                </MyBoxRow>
            </>)}
        >
            <MyBoxColumn height={3} width={3}>
                <MyBox width={3}>
                    <img
                        className={classes.img}
                        src={bp.thumb.webp ? `data:image/png;base64,${bp.thumb.webp.toString('base64')}` : 'https://via.placeholder.com/268x151?text=No+Image'}
                        alt={bp.steam.title}
                    />
                </MyBox>
            </MyBoxColumn>
            <MyBoxColumn height={1} width={3}>
                <MyBoxRow width={3}>
                    <MyBox width={3}>
                        <ValueCell label={`version`} value={bp.steam.revision}/>
                        <ValueCell label={`size (MB)`} value={bp.steam.sizeMB}/>
                        <ValueCell label={`favorites`} value={bp.steam.favoriteCount}/>
                    </MyBox>
                </MyBoxRow>
            </MyBoxColumn>
            <MyBoxColumn height={1} width={3}>
                <MyBoxRow width={3}>
                    <MyBox width={3}>
                        <ValueCell label={`if any`} value={'Collections:'} alignItems='flex-end'/>
                        <CenterCell width={2} padded direction='column' justify='flex-start' alignItems='flex-start' wrap='nowrap'>
                            {collections}
                        </CenterCell>
                    </MyBox>
                </MyBoxRow>
            </MyBoxColumn>
            <MyBoxColumn height={6} width={6}>
                <MyBoxRow height={6} width={6}>
                    <MyBox width={6}>
                        <Typography className={classes.description} variant='body1' dangerouslySetInnerHTML={{ __html: bp.steam.description}} />
                    </MyBox>
                </MyBoxRow>
            </MyBoxColumn>
        </MySectionInner>
    )
})) /* ============================================================================================================= */


type ProjectionCardSteam =
    | 'author'
    | 'collections'
    | 'commentCount'
    | 'favoriteCount'
    | 'description'
    | 'revision'
    | 'mods'
    | 'id'
    | 'popularity'
    | 'postedDate'
    | 'ratingStars'
    | 'ratingCount'
    | 'subscriberCount'
    | 'title'
    | 'sizeMB'
    | 'updatedDate'
    | 'visitorCount'

type ProjectionCardThumb =
    | 'webp'

interface IBpProjectionRow {
    steam: {[key in keyof Pick<IBlueprint.ISteam, ProjectionCardSteam>]: IBlueprint.ISteam[key]}
    thumb: {[key in keyof Pick<IBlueprint.IThumb, ProjectionCardThumb>]: IBlueprint.IThumb[key]},
}
