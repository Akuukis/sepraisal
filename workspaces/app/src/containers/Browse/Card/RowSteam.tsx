import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { createSmartFC, createStyles, formatDecimal, IMyTheme, padTo2 } from '../../../common/'
import ValueWithLabel from '../../../components/ValueWithLabel'
import { CardStatus, ICard } from '../../../models/Card'
import MyRow from '../../../components/MyRow'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },
})


interface IProps {
    id: number
    steam: ICard<CardStatus>['steam']
}


export default hot(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {
    const {id, steam} = props

    if(!steam) {
        // TODO
        return null
    }

    const postedDate = `${steam.postedDate.getUTCFullYear()}-${padTo2(steam.postedDate.getMonth() + 1)}`
    const starsValue = steam.ratingStars === null ? '-' : `${'★'.repeat(steam.ratingStars)}${'☆'.repeat(5 - steam.ratingStars)}`
    const starsDef = steam.ratingStars === null ? 'few ratings' : `${steam.ratingCount}`

    return (
        <MyRow className={classes.root}>
            <ValueWithLabel label='subscribers' value={formatDecimal(steam.subscriberCount)} />
            <ValueWithLabel label={starsDef} value={starsValue} />
            <ValueWithLabel label='posted' value={postedDate} />
            <ValueWithLabel label='author' value={steam.author.title} />
        </MyRow>
    )
})) /* ============================================================================================================= */
