import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { CardContent, Grid } from '@material-ui/core'

import { createSmartFC, createStyles, formatDecimal, IMyTheme, padTo2 } from '../../../common/'
import ValueWithLabel from '../../../components/ValueWithLabel'
import { CardStatus, ICard } from '../../../models/Card'


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
                <ValueWithLabel label='subscribers' value={formatDecimal(steam.subscriberCount)} />
                <ValueWithLabel label={starsDef} value={starsValue} />
                <ValueWithLabel label='posted' value={postedDate} />
                <ValueWithLabel label='author' value={steam.author.title} />
            </Grid>
        </CardContent>
    )
})) /* ============================================================================================================= */
