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
    operator?: string,
    step?: number,
    title: string,
    zeroes?: object
}

interface IQuery {
    $gte?: number,
    $lte?: number,
}

export default hot(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {
    const {title, findKey, operator, min, max, step: stepRaw, zeroes} = props
    const step = stepRaw ?? 1

    const piwikStore = React.useContext(CONTEXT.PIWIK)
    const cardStore = React.useContext(CONTEXT.CARDS)

    const setState = () => {
        const index = cardStore.find.$and.findIndex((obj) => Object.keys(obj).pop()! === findKey)
        const found: IQuery = index === -1 ? {} : cardStore.find.$and[index]

        return [
            (operator ? found[findKey]?.operator?.$gte : found[findKey]?.$gte) ?? min,
            (operator ? found[findKey]?.operator?.$lte : found[findKey]?.$lte) ?? max,
        ]
    }

    const [value, setValue] = React.useState(setState())

    const query: IQuery = {}
    if(value[0] !== min) query.$gte = new BigNumber(value[0]).dp(0).toNumber()
    if(value[1] !== max) {
        query.$lte = new BigNumber(value[1]).dp(0).toNumber()
    }
    const isEnabled = Object.keys(query).length !== 0

    const format = (sliderValue: number) => formatFloat(sliderValue, step >= 1)

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    React.useEffect(() => reaction(() => cardStore.find.$and, () => {
        setValue(setState())
    }))

    const onChangeCommitted = action(() => {
        // tslint:disable-next-line: no-non-null-assertion
        const index = cardStore.find.$and.findIndex((obj) => Object.keys(obj).pop()! === findKey)
        const before = cardStore.find.$and.slice(0, Math.max(0, index))
        const after = cardStore.find.$and.slice(index + 1, cardStore.find.$and.length)

        if(zeroes !== undefined && value[0] === 0 && value[1] === 0) {

            piwikStore.push([
                'trackEvent',
                'custom-filter',
                findKey,
                JSON.stringify(zeroes),
            ])

            cardStore.setFind({$and: [
                ...before,
                {[findKey]: operator ? {[operator]: zeroes} : zeroes},
                ...after,
            ]})

            return
        }

        const query: IQuery = {}
        if(value[0] !== min) query.$gte = value[0]
        if(value[1] !== max) query.$lte = value[1]

        if(!isEnabled) {

            piwikStore.push([
                'trackEvent',
                'custom-filter',
                findKey,
                JSON.stringify(null),
            ])

            cardStore.setFind({$and: [
                ...before,
                ...after,
            ]})

            return
        }


        piwikStore.push([
            'trackEvent',
            'custom-filter',
            findKey,
            JSON.stringify(`${query.$gte} - ${query.$lte}`),
        ])

        cardStore.setFind({$and: [
            ...before,
            {[findKey]: operator ? {[operator]: query} : query},
            ...after,
        ]})
    })

    const from = query.$gte !== undefined ? `from ${format(query.$gte)}` : ''
    const to = query.$lte !== undefined ? `to ${format(query.$lte)}` : ''

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
                <Typography>{from} {to}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Slider
                    className={!isEnabled ? classes.disabledSlider : undefined}
                    min={min}
                    max={max}
                    step={step}
                    value={value}
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

