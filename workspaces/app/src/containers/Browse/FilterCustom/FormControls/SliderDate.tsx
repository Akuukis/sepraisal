import clsx from 'clsx'
import { action, reaction, runInAction } from 'mobx'
import moment from 'moment'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid, Slider, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import { FindCriterionDirect } from 'src/models'
import { CONTEXT } from 'src/stores'


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
    step?: number,
    title: string,
    zeroes?: FindCriterionDirect
}

interface IMyFindCriterion {
    $gte?: string,
    $lte?: string,
}

export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {title, criterionId, step: stepRaw, zeroes} = props
    const max = moment()

    const piwikStore = React.useContext(CONTEXT.PIWIK)
    const cardStore = React.useContext(CONTEXT.CARDS)
    const formGroupScope = React.useContext(CONTEXT.FORM_GROUP_SCOPE)

    const getState = (): [number, number] => {
        const criterion = cardStore.querryFindBuilder.getCriterion<IMyFindCriterion>(criterionId)

        return [
            toValue(criterion?.$gte ?? MIN),
            toValue(criterion?.$lte ?? max),
        ]
    }

    const [value, setValue] = React.useState<[number, number]>(getState())

    let criterion: IMyFindCriterion | null = {}
    if(value[0] !== 0) criterion.$gte = toDate(value[0]).toISOString(false)
    if(value[1] !== toValue(max)) criterion.$lte = toDate(value[1]).toISOString(false)
    criterion = Object.keys(criterion).length > 0 ? criterion : null
    runInAction(() => formGroupScope.set(criterionId, undefined))

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

    const from = criterion?.$gte !== undefined ? `from ${formatValue(toValue(criterion.$gte!))}` : ''
    const to = criterion?.$lte !== undefined ? `to ${formatValue(toValue(criterion.$lte!))}` : ''

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
                    min={0}
                    max={toValue(max)}
                    step={1}
                    // marks={(max-min)/step < 50}
                    value={value}
                    onChange={handleChange}
                    onChangeCommitted={onChangeCommitted}
                    valueLabelDisplay='auto'
                    aria-labelledby='linear-slider'
                    valueLabelFormat={formatValue}
                />
            </Grid>
        </Grid>
    )

})) /* ============================================================================================================= */

const MIN = moment('2013-10-23')
const toValue = (date: string | moment.Moment) => moment(date).diff(MIN, 'days')
const toDate = (value: number) => moment(MIN).add(value, 'days')
const formatValue = (daysSinceMin: number) => toDate(daysSinceMin).format('D MMM, YYYY')

interface IMark {
    value: number,
    label: string
}

const MARKS: IMark[] = [
    {value: toValue('2013-10-23'), label: 'Early Access'},  // https://www.spaceengineersgame.com/space-engineers-ndash-released-on-steam-early-access.html
    {value: toValue('2017-11-17'), label: 'Physics'},  // 
    {value: toValue('2018-02-02'), label: 'Wheels'},  // 
    {value: toValue('2018-07-19'), label: 'Multiplayer'},  // 
    {value: toValue('2019-02-28'), label: 'Survival'},  // 
    {value: toValue('2019-04-08'), label: 'LCDs'},  // 
]
