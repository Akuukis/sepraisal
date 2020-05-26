import clsx from 'clsx'
import { action, reaction, runInAction } from 'mobx'
import moment from 'moment'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid, Slider, TextField, Typography, ValueLabelProps } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import { FindCriterionDirect } from 'src/models'
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
    title: string,
    zeroes?: FindCriterionDirect
}

interface IMyFindCriterion {
    $gte?: string,
    $lte?: string,
}

export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {title, criterionId, zeroes} = props
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
    const from = MARKS
        .filter((mark) => mark.value - value[0] <= 0)
        .sort((a, b) => (b.value - value[0]) - (a.value - value[0]))
        [0]
    const to = MARKS
        .filter((mark) => mark.value - value[1] >= 0)
        .sort((a, b) => (a.value - value[1]) - (b.value - value[1]))
        [0]


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

    const onChangeCommitted = (value: [number, number]) => action(() => {
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

    const fromLabel = criterion?.$gte !== undefined ? `from ${formatValue(toValue(criterion.$gte!))}` : ''
    const toLabel = criterion?.$lte !== undefined ? `to ${formatValue(toValue(criterion.$lte!))}` : ''

    const handleFrom = (event: React.ChangeEvent<HTMLInputElement>) => {
        const mark = MARKS.find((mark) => mark.version === event.target.value)!
        const newValue: [number, number] = [mark.value, value[1]]
        setValue(newValue)
        onChangeCommitted(newValue)()
    };
    const handleTo = (event: React.ChangeEvent<HTMLInputElement>) => {
        const mark = MARKS.find((mark) => mark.version === event.target.value)!
        const newValue: [number, number] = [value[0], mark.value]
        setValue(newValue)
        onChangeCommitted(newValue)()
    };

    return (
        <Grid container justify='space-between' alignItems='center' className={classes.root}>
            <Grid item>
                <Typography
                    id='linear-slider'
                    className={clsx(!criterion && classes.inactiveLabel)}
                >
                    {title}
                </Typography>
            </Grid>
            <Grid item>
                <Typography variant='body2'>{fromLabel} {toLabel}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Slider
                    className={clsx(!criterion && classes.inactiveSlider)}
                    min={0}
                    max={toValue(max)}
                    step={1}
                    marks={MARKS}
                    value={value}
                    onChange={handleChange}
                    onChangeCommitted={onChangeCommitted(value)}
                    valueLabelDisplay='auto'
                    aria-labelledby='linear-slider'
                    valueLabelFormat={formatValue}
                    ValueLabelComponent={SliderLabel as React.ElementType<ValueLabelProps>}
                />
            </Grid>
            <TextField
                id='from-version'
                select
                variant='outlined'
                label="From game version:"
                value={from.version}
                onChange={handleFrom}
                SelectProps={{
                    native: true
                }}
            >
                {MARKS.map((option) => (
                    <option key={option.version} value={option.version} disabled={option.value > value[1]}>
                        {`${option.version} ${option.summary} (${formatValue(option.value)})`}
                    </option>
                ))}
            </TextField>
            <TextField
                id='to-version'
                select
                variant='outlined'
                label="To game version:"
                value={to.version}
                onChange={handleTo}
                SelectProps={{
                    native: true
                }}
            >
                {MARKS.map((option) => (
                    <option key={option.version} value={option.version} disabled={option.value < value[0]}>
                        {`${option.version} ${option.summary} (${formatValue(option.value)})`}
                    </option>
                ))}
            </TextField>
        </Grid>
    )

})) /* ============================================================================================================= */

const MIN = moment('2013-10-23')
const toValue = (date: string | moment.Moment) => moment(date).diff(MIN, 'days')
const toDate = (value: number) => moment(MIN).add(value, 'days')
const formatValue = (daysSinceMin: number) => toDate(daysSinceMin).format('D MMM, YYYY')

interface IMark {
    value: number
    version: string
    summary: string
    // label: never  // So that slider doesn't show anything.
}

// https://www.spaceengineersgame.com/news.html
const MARKS: IMark[] = [
    {value: toValue('2013-10-23'), version: '1.000', summary: 'Early Access'},

    {value: toValue('2014-01-16'), version: '1.015', summary: 'Multiplayer'},
    {value: toValue('2014-03-13'), version: '1.021', summary: 'Survival Mode'},
    // {value: toValue('2014-03-20'), version: '1.023', summary: 'Solar Panels & Thruster Damage'},
    {value: toValue('2014-04-24'), version: '1.027', summary: 'Turrets'},
    // {value: toValue('2014-05-22'), version: '1.031', summary: 'Welder & Grinder'},
    // {value: toValue('2014-06-26'), version: '1.036', summary: 'Conveyor system'},
    {value: toValue('2014-07-10'), version: '1.038', summary: 'Wheels'},
    // {value: toValue('2014-07-24'), version: '1.040', summary: 'Pistons'},
    // {value: toValue('2014-09-11'), version: '1.047', summary: 'Remote Control'},
    // {value: toValue('2014-09-18'), version: '1.048', summary: 'ModAPI & Fighter Cockpit'},  // And reloadable rocket launcher
    // {value: toValue('2014-10-02'), version: '1.050', summary: 'Blueprints'},
    // {value: toValue('2014-10-23'), version: '1.053', summary: 'Advanced Rotor Block'},
    {value: toValue('2014-11-27'), version: '1.058', summary: 'Projector Block'},
    // {value: toValue('2014-12-11'), version: '1.060', summary: 'Sound Block'},

    {value: toValue('2015-01-01'), version: '1.063', summary: 'Programmable block'},
    // {value: toValue('2015-01-15'), version: '1.065', summary: 'Communications'},
    // {value: toValue('2015-02-05'), version: '1.068', summary: 'Tool Shaking'},
    // {value: toValue('2015-02-12'), version: '1.069', summary: 'Round & Angled armor'},
    {value: toValue('2015-02-15'), version: '1.070', summary: 'LCD Panel'},
    // {value: toValue('2015-03-06'), version: '1.072', summary: 'Laser Antenna'},
    {value: toValue('2015-03-19'), version: '1.074', summary: 'Oxygen & Ice'},
    // {value: toValue('2015-03-26'), version: '1.075', summary: 'Airtight Hangar Door'},
    // {value: toValue('2015-04-23'), version: '1.079', summary: 'Oxygen Farm'},
    // {value: toValue('2015-04-30'), version: '1.080', summary: 'Cryo Chamber'},
    // {value: toValue('2015-05-07'), version: '1.081', summary: 'Upgrade Modules'},
    {value: toValue('2015-05-28'), version: '1.084', summary: 'DirectX 11'},
    {value: toValue('2015-07-30'), version: '1.093', summary: 'Inventory mass'},
    // {value: toValue('2015-08-13'), version: '1.095', summary: 'Rebalance costs'},
    // {value: toValue('2015-09-18'), version: '1.100', summary: 'Drones'},
    {value: toValue('2015-10-22'), version: '1.105', summary: 'Realistic dampeners & Hydrogen'},
    {value: toValue('2015-11-12'), version: '1.108', summary: 'Planets'},
    // {value: toValue('2015-12-03'), version: '1.111', summary: 'Tool Tiers'},

    {value: toValue('2016-03-03'), version: '1.124', summary: 'Safety Lock for Rotor & Piston'},
    // {value: toValue('2016-03-24'), version: '1.127', summary: 'Replace destroyed wheels'},
    // {value: toValue('2016-04-13'), version: '1.130', summary: 'Re-attach piston heads'},
    // {value: toValue('2016-05-05'), version: '1.133', summary: 'Connector Welding'},
    {value: toValue('2016-05-26'), version: '1.136', summary: 'Last DX9 version'},
    // {value: toValue('2016-06-02'), version: '1.137', summary: 'GPU Particles'},
    // {value: toValue('2016-06-30'), version: '1.142', summary: 'Revised Building System'},
    {value: toValue('2016-09-22'), version: '1.154', summary: 'Configurable Block Limits'},
    {value: toValue('2016-12-08'), version: '1.165', summary: 'Block DX11 Redesign'},

    // {value: toValue('2017-01-26'), version: '1.172', summary: 'Overhaul ModAPI & Programmable Block'},
    // {value: toValue('2017-03-23'), version: '1.179', summary: 'New HUD & UI'},
    // {value: toValue('2017-04-13'), version: '1.180', summary: 'Server browser'},
    {value: toValue('2017-06-01'), version: '1.181', summary: 'Multi-thread physics'},
    // {value: toValue('2017-07-20'), version: '1.182', summary: 'Major optimizations'},
    {value: toValue('2017-08-17'), version: '1.183', summary: 'Parachute blocks'},
    {value: toValue('2017-09-14'), version: '1.184', summary: 'Half-armor blocks'},
    {value: toValue('2017-11-17'), version: '1.185', summary: 'Overhaul Physics'},

    {value: toValue('2018-02-02'), version: '1.186', summary: 'Overhaul Wheels'},
    {value: toValue('2018-07-19'), version: '1.187', summary: 'Overhaul Multiplayer'},
    {value: toValue('2018-10-23'), version: '1.189', summary: 'Airtightness'},

    {value: toValue('2019-02-28'), version: '1.190', summary: 'Overhaul Survival & Launch'},
    {value: toValue('2019-04-08'), version: '1.191', summary: 'Overhaul LCDs'},
    {value: toValue('2019-06-06'), version: '1.192', summary: 'Build Planner'},
    {value: toValue('2019-08-22'), version: '1.193', summary: 'Economy'},

    {value: toValue('2020-04-16'), version: '1.194', summary: 'Triton & Frostbite Pack'},

    {value: toValue(moment()), version: '?.???', summary: 'Today'},
]
