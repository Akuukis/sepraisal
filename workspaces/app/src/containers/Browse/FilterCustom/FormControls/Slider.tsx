import BigNumber from 'bignumber.js'
import clsx from 'clsx'
import { action, reaction, runInAction } from 'mobx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid, Slider, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, formatDecimal, IMyTheme } from 'src/common'
import { FindCriterionDirect } from 'src/models'
import { CONTEXT } from 'src/stores'

import SliderLabel from './SliderLabel'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        marginTop: theme.spacing(1),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
    },

    inactiveLabel: {
        color: theme.palette.text.secondary,
    },
    inactiveSlider: {
        color: theme.palette.text.secondary,
    },
})


interface IProps {
    criterionId: string,
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
    const {title, criterionId, min, max, step: stepRaw, zeroes} = props
    const step = stepRaw ?? 1
    const dp = step < 1 ? 1 : 0

    const piwikStore = React.useContext(CONTEXT.PIWIK)
    const cardStore = React.useContext(CONTEXT.CARDS)
    const formGroupScope = React.useContext(CONTEXT.FORM_GROUP_SCOPE)

    const getState = (): [number, number] => {
        const criterion = cardStore.querryFindBuilder.getCriterion<IMyFindCriterion>(criterionId)

        return [
            criterion?.$gte ?? min,
            criterion?.$lte ?? max,
        ]
    }

    const [value, setValue] = React.useState<[number, number]>(getState())

    let criterion: IMyFindCriterion | null = {}
    if(value[0] !== min) criterion.$gte = new BigNumber(value[0]).dp(dp).toNumber()
    if(value[1] !== max) criterion.$lte = new BigNumber(value[1]).dp(dp).toNumber()
    criterion = Object.keys(criterion).length > 0 ? criterion : null
    runInAction(() => formGroupScope.set(criterionId, undefined))

    const format = (sliderValue: number) => formatDecimal(sliderValue, dp)

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    React.useEffect(() => reaction(() => cardStore.querryFindBuilder.find.$and, () => {
        setValue(getState())
    }))

    const onChangeCommitted = action(() => {
        if(zeroes !== undefined && value[0] === 0 && value[1] === 0) {
            piwikStore.push([
                'trackEvent',
                'custom-filter',
                criterionId,
                JSON.stringify(zeroes),
            ])
            cardStore.querryFindBuilder.setCriterion(criterionId, zeroes)

            return
        }

        piwikStore.push([
            'trackEvent',
            'custom-filter',
            criterionId,
            criterion ? JSON.stringify(`${criterion.$gte} - ${criterion.$lte}`) : JSON.stringify(null),
        ])
        cardStore.querryFindBuilder.setCriterion(criterionId, criterion)
    })

    const from = criterion?.$gte !== undefined ? `from ${format(criterion.$gte)}` : ''
    const to = criterion?.$lte !== undefined ? `to ${format(criterion.$lte)}` : ''

    return (
        <Grid container justify='space-between' className={classes.root}>
            <Grid item>
                <Typography
                    id='linear-slider'
                    className={clsx(!criterion && classes.inactiveLabel)}
                >
                    {title}
                </Typography>
            </Grid>
            <Grid item>
                <Typography variant='body2'>{from} {to}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Slider
                    className={clsx(!criterion && classes.inactiveSlider)}
                    min={min}
                    max={max}
                    step={step}
                    marks={(max-min)/step < 50}
                    value={value}
                    onChange={handleChange}
                    onChangeCommitted={onChangeCommitted}
                    valueLabelDisplay='auto'
                    aria-labelledby='linear-slider'
                    valueLabelFormat={format}
                    ValueLabelComponent={SliderLabel}
                />
            </Grid>
        </Grid>
    )

})) /* ============================================================================================================= */

