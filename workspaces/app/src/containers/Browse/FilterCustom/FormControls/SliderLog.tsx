import BigNumber from 'bignumber.js'
import clsx from 'clsx'
import { action, reaction, runInAction } from 'mobx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid, Slider, Typography, ValueLabelProps } from '@material-ui/core'

import { createSmartFC, createStyles, formatFloat, IMyTheme } from 'src/common'
import { CONTEXT } from 'src/stores'

import SliderLabel from './SliderLabel'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        marginTop: theme.spacing(2),
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
    title: string,
    zeroes?: object
}

interface IQuery {
    $gte?: number,
    $lte?: number,
}

export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {title, criterionId, min, max, zeroes} = props
    const piwikStore = React.useContext(CONTEXT.PIWIK)
    const cardStore = React.useContext(CONTEXT.CARDS)
    const formGroupScope = React.useContext(CONTEXT.FORM_GROUP_SCOPE)
    const safeMin = min === 0 ? 0 : Math.log10(min)
    const safeMax = Math.log10(max)

    const setState = (): [number, number] => {
        const criterion = cardStore.querryFindBuilder.getCriterion<IQuery>(criterionId)

        return [
            criterion?.$gte ? Math.log10(criterion.$gte) : safeMin,
            criterion?.$lte ? Math.log10(criterion.$lte) : safeMax,
        ]
    }

    const [logValue, setLogValue] = React.useState<[number, number]>(setState())

    let criterion: IQuery | null = {}
    if(logValue[0] !== min) {
        criterion.$gte = new BigNumber(Math.pow(10, logValue[0])).dp(0).toNumber()
    }
    if(logValue[1] !== Infinity && Math.pow(10, logValue[1]) !== max) {
        criterion.$lte = logValue[1] === 0 ? 0 : new BigNumber(Math.pow(10, logValue[1])).dp(0).toNumber()
    }
    criterion = Object.keys(criterion).length > 0 ? criterion : null
    runInAction(() => formGroupScope.set(criterionId, undefined))

    const handleChange = (event, newValue) => {
        setLogValue(newValue)
    }

    React.useEffect(() => reaction(() => cardStore.querryFindBuilder.find.$and, () => {
        setLogValue(setState())
    }))

    const onChangeCommitted = action(() => {
        if(zeroes !== undefined && logValue[0] === 0 && logValue[1] === 0) {
            piwikStore.push([
                'trackEvent',
                'custom-filter',
                criterionId,
                String(zeroes),
            ])
            cardStore.querryFindBuilder.setCriterion(criterionId, zeroes)

            return
        }

        piwikStore.push([
            'trackEvent',
            'custom-filter',
            criterionId,
            criterion ? `${criterion.$gte} to ${criterion.$lte}` : JSON.stringify(null),
        ])
        cardStore.querryFindBuilder.setCriterion(criterionId, criterion)
    })

    const from = criterion?.$gte !== undefined ? `from ${formatFloat(criterion.$gte)}` : ''
    const to = criterion?.$lte !== undefined ? `to ${formatFloat(criterion.$lte)}` : ''
    const marks = Array.from(Array(10), (_, i) => ({
        value: Math.log10(min + (max - min) / 10 * (i+1)),
    }))

    return (
        <Grid container justify='space-between' alignItems='center' className={classes.root}>
            <Grid item>
                <Typography
                    id='log-slider'
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
                    min={safeMin}
                    max={safeMax}
                    step={(safeMax - safeMin) / 1000}
                    value={logValue}
                    marks={marks}
                    onChange={handleChange}
                    onChangeCommitted={onChangeCommitted}
                    valueLabelDisplay='auto'
                    aria-labelledby='log-slider'
                    valueLabelFormat={format}
                    ValueLabelComponent={SliderLabel as React.ElementType<ValueLabelProps>}
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
