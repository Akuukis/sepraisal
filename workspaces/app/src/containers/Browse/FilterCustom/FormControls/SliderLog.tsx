import BigNumber from 'bignumber.js'
import { action, reaction } from 'mobx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid, Slider, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, formatFloat, IMyTheme } from 'src/common'
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
    title: string,
    zeroes?: object
}

interface IQuery {
    $gte?: number,
    $lte?: number,
}

export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {title, findKey, min, max, zeroes} = props
    const piwikStore = React.useContext(CONTEXT.PIWIK)
    const cardStore = React.useContext(CONTEXT.CARDS)
    const safeMin = min === 0 ? 0 : Math.log10(min)
    const safeMax = Math.log10(max)

    const setState = (): [number, number] => {
        const criterion = cardStore.querryFindBuilder.getCriterion<IQuery>(findKey)

        return [
            criterion?.[findKey]?.$gte ? Math.log10(criterion[findKey].$gte) : safeMin,
            criterion?.[findKey]?.$lte ? Math.log10(criterion[findKey].$lte) : safeMax,
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
                findKey,
                String(zeroes),
            ])
            cardStore.querryFindBuilder.setCriterion(findKey, zeroes)

            return
        }

        piwikStore.push([
            'trackEvent',
            'custom-filter',
            findKey,
            criterion ? `${criterion.$gte} to ${criterion.$lte}` : JSON.stringify(null),
        ])
        cardStore.querryFindBuilder.setCriterion(findKey, criterion)
    })

    const from = criterion?.$gte !== undefined ? `from ${formatFloat(criterion.$gte)}` : ''
    const to = criterion?.$lte !== undefined ? `to ${formatFloat(criterion.$lte)}` : ''

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
                <Typography id='range-slider'>{from} {to}</Typography>
            </Grid>
            <Grid item xs={12}>
                <Slider
                    className={!criterion ? classes.disabledSlider : undefined}
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
