import { IBlueprint } from '@sepraisal/common'
import clsx from 'clsx'
import moment from 'moment'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Link } from '@material-ui/core'

import {
    createSmartFC,
    createStyles,
    formatDecimal,
    IMyTheme,
    linkAuthorProps,
    linkBpProps,
    linkCollectionProps,
    THUMB_HEIGHT,
    THUMB_WIDTH,
} from 'src/common'
import ValueCell from 'src/components/Cell/ValueCell'

import MyBox from '../MyBox'
import MyBoxColumn from '../MyBoxColumn'
import MyBoxRow from '../MyBoxRow'
import Table from '../Table'
import MySection from './MySection'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    img: {
        width: '100%',
        height: '100%',
        objectFit: 'fill',
    },
    contentTable: {
        width: '100%',
    },
})


interface IProps extends Omit<React.ComponentProps<typeof MySection>, 'heading' | 'value' | 'label'> {
    bp: IBpProjectionRow
    long?: boolean
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {bp, className, long, ...otherProps} = props


    const starsValue = bp.steam.ratingStars === null ? '-' : `${'★'.repeat(bp.steam.ratingStars)}${'☆'.repeat(5 - bp.steam.ratingStars)}`
    const starsDef = bp.steam.ratingStars === null ? 'few ratings' : `${bp.steam.ratingCount}`
    const author = (<Link variant='body2' {...linkAuthorProps(bp.steam.authors[0]?.id)}>
            {bp.steam.authors[0]?.title ?? bp.steam.authors[0]?.id}
        </Link>)

    const placeholderThumb = `//via.placeholder.com/${THUMB_WIDTH}x${THUMB_HEIGHT}?text=No+Image`

    return (
        <MySection
            heading='Workshop'
            label='subscribers'
            value={formatDecimal(bp.steam.subscriberCount)}
            className={clsx(classes.root, className)}
            {...otherProps}
            MyBoxColumnProps={{height: 3}}
            innerChildren={(<>
                <MyBoxRow width={3}>
                    <MyBox width={3}>
                        <ValueCell label={`author`} value={author}/>
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
                        src={bp.thumb.webp ? `data:image/png;base64,${bp.thumb.webp.toString('base64')}` : placeholderThumb}
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
                        <ValueCell width={3} label={`listed DLCs`} value={bp.steam.DLCsCount || '-'}/>
                    </MyBox>
                </MyBoxRow>
            </MyBoxColumn>
            <MyBoxColumn height={3} width={3}>
                <MyBoxRow width={3}>
                    <MyBox width={3}>
                        <Table
                            className={classes.contentTable}
                            columns={['collection']}
                            headers={{collection: `Listed Collections (${bp.steam.collections.length})`}}
                            data={bp.steam.collections.map((collection, i) => ({
                                collection: (<Link key={i} variant='body2' noWrap {...linkCollectionProps(collection.id)}>
                                    {collection.title ?? collection.id}
                                </Link>)
                            }))}
                        />
                    </MyBox>
                </MyBoxRow>
            </MyBoxColumn>
            <MyBoxColumn height={3} width={3}>
                <MyBoxRow width={3}>
                    <MyBox width={3}>
                        <Table
                            className={classes.contentTable}
                            columns={['mod']}
                            headers={{mod: `Listed Mods (${bp.steam.mods.length})`}}
                            data={bp.steam.mods.map((mod) => ({
                                mod: (<Link variant='body2' noWrap {...linkBpProps(mod.id as number)}>
                                    {mod.title ?? mod.id}
                                </Link>)
                            }))}
                        />
                    </MyBox>
                </MyBoxRow>
            </MyBoxColumn>
        </MySection>
    )
})) /* ============================================================================================================= */


type ProjectionCardSteam =
    | 'authors'
    | 'collections'
    | 'collectionsCount'
    | 'commentCount'
    | 'favoriteCount'
    | 'revision'
    | 'mods'
    | 'modsCount'
    | 'DLCs'
    | 'DLCsCount'
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
