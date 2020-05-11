import BigNumber from 'bignumber.js'
import { action, reaction } from 'mobx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid, Slider, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, formatFloat, IMyTheme } from 'src/common'
import { FindCriterionDirect } from 'src/models'
import { CONTEXT } from 'src/stores'


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
    step?: number,
    title: string,
    zeroes?: FindCriterionDirect
}

interface IMyFindCriterion {
    $gte?: number,
    $lte?: number,
}

export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {title, findKey, min, max, step: stepRaw, zeroes} = props
    const step = stepRaw ?? 1

    const piwikStore = React.useContext(CONTEXT.PIWIK)
    const cardStore = React.useContext(CONTEXT.CARDS)

    const setState = (): [number, number] => {
        const criterion = cardStore.querryFindBuilder.getCriterion<IMyFindCriterion>(findKey)

        return [
            criterion?.[findKey]?.$gte ?? min,
            criterion?.[findKey]?.$lte ?? max,
        ]
    }

    const [value, setValue] = React.useState<[number, number]>(setState())

    const query: IMyFindCriterion = {}
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

        if(zeroes !== undefined && value[0] === 0 && value[1] === 0) {

            piwikStore.push([
                'trackEvent',
                'custom-filter',
                findKey,
                JSON.stringify(zeroes),
            ])
            cardStore.querryFindBuilder.setCriterion(findKey, zeroes)

            return
        }

        const criterion: IMyFindCriterion = {}
        if(value[0] !== min) criterion.$gte = value[0]
        if(value[1] !== max) criterion.$lte = value[1]

        if(!isEnabled) {
            piwikStore.push([
                'trackEvent',
                'custom-filter',
                findKey,
                JSON.stringify(null),
            ])
            cardStore.querryFindBuilder.setCriterion(findKey, null)

            return
        }

        piwikStore.push([
            'trackEvent',
            'custom-filter',
            findKey,
            JSON.stringify(`${criterion.$gte} - ${criterion.$lte}`),
        ])
        cardStore.querryFindBuilder.setCriterion(findKey, criterion)
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

