import { IBlueprint } from '@sepraisal/common'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { createSmartFC, createStyles, IMyTheme, THUMB_HEIGHT, THUMB_WIDTH } from 'src/common'

import MySection from './MySection'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        padding: theme.spacing(1, 0),
        width: '100%',
        height: '100%',
        objectFit: 'cover',
    },
})


interface IProps extends Omit<React.ComponentProps<typeof MySection>, 'heading' | 'value' | 'label'> {
    bp: IBpProjectionRow
    long?: boolean
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {bp, className, long, ...otherProps} = props

    const placeholderThumb = `//via.placeholder.com/${THUMB_WIDTH}x${THUMB_HEIGHT}?text=No+Image`

    return (
        <img
            className={classes.root}
            src={bp.thumb.webp ? `data:image/png;base64,${bp.thumb.webp.toString('base64')}` : placeholderThumb}
            alt={bp.steam.title}
        />
    )
})) /* ============================================================================================================= */


type ProjectionCardSteam =
    | 'title'

type ProjectionCardThumb =
    | 'webp'

interface IBpProjectionRow {
    steam: {[key in keyof Pick<IBlueprint.ISteam, ProjectionCardSteam>]: IBlueprint.ISteam[key]}
    thumb: {[key in keyof Pick<IBlueprint.IThumb, ProjectionCardThumb>]: IBlueprint.IThumb[key]},
}
