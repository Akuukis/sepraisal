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
    const min = moment(DATES[0][0])
    const max = moment()
    const step = stepRaw ?? 1

    const piwikStore = React.useContext(CONTEXT.PIWIK)
    const cardStore = React.useContext(CONTEXT.CARDS)
    const formGroupScope = React.useContext(CONTEXT.FORM_GROUP_SCOPE)

    const getState = (): [number, number] => {
        const criterion = cardStore.querryFindBuilder.getCriterion<IMyFindCriterion>(criterionId)

        return [
            min.diff(criterion?.$gte ?? min, 'days'),
            -min.diff(criterion?.$lte ?? max, 'days'),
        ]
    }

    const [value, setValue] = React.useState<[number, number]>(getState())

    let criterion: IMyFindCriterion | null = {}
    if(value[0] !== 0) criterion.$gte = moment(min).add(value[0], 'days').toISOString(false)
    if(value[1] !== max.diff(min, 'days')) criterion.$lte = moment(min).add(value[1], 'days').toISOString(false)
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

    const from = criterion?.$gte !== undefined ? `from ${format(-min.diff(criterion.$gte, 'days'))}` : ''
    const to = criterion?.$lte !== undefined ? `to ${format(-min.diff(criterion.$lte, 'days'))}` : ''
    console.log(min.toISOString(), max.toISOString(), value)
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
                    max={max.diff(min, 'days')}
                    step={1}
                    // marks={(max-min)/step < 50}
                    value={value}
                    onChange={handleChange}
                    onChangeCommitted={onChangeCommitted}
                    valueLabelDisplay='auto'
                    aria-labelledby='linear-slider'
                    valueLabelFormat={format}
                />
            </Grid>
        </Grid>
    )

})) /* ============================================================================================================= */


const format = (daysSinceMin: number) => moment(DATES[0][0]).add(daysSinceMin, 'days').format('D MMM, YYYY')

const DATES = [
    [moment('2013-10-23'), 'Early Access'],  // https://www.spaceengineersgame.com/space-engineers-ndash-released-on-steam-early-access.html
]
