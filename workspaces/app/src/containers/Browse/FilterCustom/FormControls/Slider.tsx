import BigNumber from 'bignumber.js'
import { action, reaction, runInAction } from 'mobx'
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
    const formGroupScope = React.useContext(CONTEXT.FORM_GROUP_SCOPE)

    const setState = (): [number, number] => {
        const criterion = cardStore.querryFindBuilder.getCriterion<IMyFindCriterion>(findKey)

        return [
            criterion?.$gte ?? min,
            criterion?.$lte ?? max,
        ]
    }

    const [value, setValue] = React.useState<[number, number]>(setState())

    let criterion: IMyFindCriterion | null = {}
    if(value[0] !== min) criterion.$gte = new BigNumber(value[0]).dp(0).toNumber()
    if(value[1] !== max) criterion.$lte = new BigNumber(value[1]).dp(0).toNumber()
    criterion = Object.keys(criterion).length > 0 ? criterion : null
    runInAction(() => formGroupScope.set(findKey, undefined))

    const format = (sliderValue: number) => formatFloat(sliderValue, step >= 1)

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    React.useEffect(() => reaction(() => cardStore.querryFindBuilder.find.$and, () => {
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

        piwikStore.push([
            'trackEvent',
            'custom-filter',
            findKey,
            criterion ? JSON.stringify(`${criterion.$gte} - ${criterion.$lte}`) : JSON.stringify(null),
        ])
        cardStore.querryFindBuilder.setCriterion(findKey, criterion)
    })

    const from = criterion?.$gte !== undefined ? `from ${format(criterion.$gte)}` : ''
    const to = criterion?.$lte !== undefined ? `to ${format(criterion.$lte)}` : ''

    return (
        <Grid container justify='space-between' className={classes.root}>
            <Grid item>
                <Typography
                    id='range-slider'
                    style={!criterion ? {color: theme.palette.text.disabled} : {}}
                >
                    {title}
                </Typography>
            </Grid>
            <Grid item>
                <Typography>{from} {to}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Slider
                    className={!criterion ? classes.disabledSlider : undefined}
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

