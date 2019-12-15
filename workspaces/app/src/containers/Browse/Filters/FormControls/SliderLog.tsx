import BigNumber from 'bignumber.js'
import { action, reaction } from 'mobx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid, Slider, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, formatFloat, IMyTheme } from '../../../../common/'
import { CONTEXT } from '../../../../stores'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        marginTop: theme.spacing(1),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
    },

    disabledSlider: {
        color: '#9e9e9e',
    },
})


interface IProps {
    findKey: string,
    max: number,
    min: number,
    title: string,
    zeroes?: object
}

interface IQuery {
    $gte?: number,
    $lte?: number,
}

export default hot(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {
    const {title, findKey, min, max, zeroes} = props
    const cardStore = React.useContext(CONTEXT.CARDS)
    const safeMin = min === 0 ? 0 : Math.log10(min)
    const safeMax = Math.log10(max)

    const [logValue, setLogValue] = React.useState([safeMin, safeMax])

    const query: IQuery = {}
    if(logValue[0] !== min) {
        query.$gte = new BigNumber(Math.pow(10, logValue[0])).dp(0).toNumber()
    }
    if(logValue[1] !== Infinity && Math.pow(10, logValue[1]) !== max) {
        query.$lte = logValue[1] === 0 ? 0 : new BigNumber(Math.pow(10, logValue[1])).dp(0).toNumber()
    }
    const isEnabled = Object.keys(query).length !== 0

    const handleChange = (event, newValue) => {
        setLogValue(newValue)
    }

    React.useEffect(() => reaction(() => cardStore.find.$and, ($and) => {
        const index = $and.findIndex((obj) => Object.keys(obj).pop()! === findKey)
        const query: IQuery = index === -1 ? {} : cardStore.find.$and[index]

        setLogValue([
            query[findKey]?.$gte ? Math.log10(query[findKey].$gte) : safeMin,
            query[findKey]?.$lte ? Math.log10(query[findKey].$lte) : safeMax,
        ])
    }))

    const onChangeCommitted = action(() => {
        // tslint:disable-next-line: no-non-null-assertion
        const index = cardStore.find.$and.findIndex((obj) => Object.keys(obj).pop()! === findKey)
        const before = cardStore.find.$and.slice(0, Math.max(0, index))
        const after = cardStore.find.$and.slice(index + 1, cardStore.find.$and.length)

        if(zeroes !== undefined && logValue[0] === 0 && logValue[1] === 0) {
            cardStore.setFind({$and: [
                ...before,
                {[findKey]: zeroes},
                ...after,
            ]})

            return
        }

        if(!isEnabled) {
            cardStore.setFind({$and: [
                ...before,
                ...after,
            ]})

            return
        }

        cardStore.setFind({$and: [
            ...before,
            {[findKey]: query},
            ...after,
        ]})
    })

    const from = query.$gte !== undefined ? `from ${formatFloat(query.$gte)}` : ''
    const to = query.$lte !== undefined ? `to ${formatFloat(query.$lte)}` : ''

    return (
        <Grid container justify='space-between' className={classes.root}>
            <Grid item>
                <Typography
                    id='range-slider'
                    style={!isEnabled ? {color: theme.palette.text.disabled} : {}}
                >
                    {title}
                </Typography>
            </Grid>
            <Grid item>
                <Typography id='range-slider'>{from} {to}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Slider
                    className={!isEnabled ? classes.disabledSlider : undefined}
                    min={safeMin}
                    max={safeMax}
                    step={(safeMax - safeMin) / 100}
                    value={logValue}
                    onChange={handleChange}
                    onChangeCommitted={onChangeCommitted}
                    valueLabelDisplay='auto'
                    aria-labelledby='range-slider'
                    valueLabelFormat={format}
                />
            </Grid>
        </Grid>
    )

})) /* ============================================================================================================= */


const format = (sliderValue: number) => {
    if(sliderValue === 0) return 0

    const value = Math.round(Math.pow(10, sliderValue))

    return formatFloat(value)
}
