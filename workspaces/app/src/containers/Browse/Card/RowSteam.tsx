import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { createSmartFC, createStyles, formatDecimal, IMyTheme, padTo2 } from '../../../common/'
import ValueCell from '../../../components/Cell/ValueCell'
import MyBox from '../../../components/MyBox'
import MyBoxColumn from '../../../components/MyBoxColumn'
import MyBoxRow from '../../../components/MyBoxRow'
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
        <MyBoxColumn>
            <MyBoxRow>
                <MyBox width={4}>
                    <ValueCell width={1} label='subscribers' value={formatDecimal(steam.subscriberCount)} />
                    <ValueCell width={1} label={starsDef} value={starsValue} />
                    <ValueCell width={1} label='posted' value={postedDate} />
                    <ValueCell width={1} label='author' value={steam.author.title} />
                </MyBox>
            </MyBoxRow>
        </MyBoxColumn>
    )
})) /* ============================================================================================================= */
