import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { CardContent, Grid } from '@material-ui/core'

import { createSmartFC, createStyles, formatDecimal, IMyTheme, padTo2, SE_COLORS } from '../../../common/'
import KeyValueBox from '../../../components/KeyValueBox'
import { CardStatus, ICard } from '../../../models/Card'
import { CONTEXT } from '../../../stores'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        paddingBottom: theme.spacing(1),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingTop: theme.spacing(1),
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
        <CardContent className={classes.root}>
            <Grid container spacing={0} alignItems='center'>
                <KeyValueBox def='subscribers' value={formatDecimal(steam.subscriberCount)} />
                <KeyValueBox def='posted' value={postedDate} />
                <KeyValueBox def={starsDef} value={starsValue} />
                <KeyValueBox def='author' value={steam.author.title} />
            </Grid>
        </CardContent>
    )
})) /* ============================================================================================================= */
