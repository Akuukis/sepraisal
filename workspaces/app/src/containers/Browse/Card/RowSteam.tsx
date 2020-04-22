import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { createSmartFC, createStyles, formatDecimal, IMyTheme, padTo2 } from '../../../common/'
import ValueCell from '../../../components/Cell/ValueCell'
import { CardStatus, ICard } from '../../../models/Card'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },
})


interface IProps {
    id: number
    steam: ICard<CardStatus>['steam']
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {id, steam} = props

    if(!steam) {
        // TODO
        return null
    }

    const postedDate = `${steam.postedDate.getUTCFullYear()}-${padTo2(steam.postedDate.getMonth() + 1)}`
    const starsValue = steam.ratingStars === null ? '-' : `${'★'.repeat(steam.ratingStars)}${'☆'.repeat(5 - steam.ratingStars)}`
    const starsDef = steam.ratingStars === null ? 'few ratings' : `${steam.ratingCount}`

    return (
        <>
            <ValueCell label='subscribers' value={formatDecimal(steam.subscriberCount)} />
            <ValueCell label={starsDef} value={starsValue} />
            <ValueCell label='posted' value={postedDate} />
            <ValueCell label='author' value={steam.author.title} />
        </>
    )
})) /* ============================================================================================================= */
