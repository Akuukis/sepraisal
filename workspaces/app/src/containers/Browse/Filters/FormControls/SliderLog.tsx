import { action, reaction } from 'mobx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Slider, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, formatFloat, IMyTheme } from '../../../../common/'
import { CONTEXT } from '../../../../stores'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    content: {
    },
    heading: {
        flexBasis: '33.33%',
        flexShrink: 0,
        fontSize: theme.typography.pxToRem(15),
    },
    secondaryHeading: {
        color: theme.palette.text.secondary,
        fontSize: theme.typography.pxToRem(15),
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

    const [logValue, setLogValue] = React.useState([min, max])

    const handleChange = (event, newValue) => {
        setLogValue(newValue)
    }

    // React.useEffect(() => reaction(() => cardStore.find.$and, ($and) => {
    //         const index = $and.findIndex((obj) => Object.keys(obj).pop()! === findKey)
    //         const query: IQuery = index === -1 ? {} : cardStore.find.$and[index]

    //         setLogValue([
    //             query.$gte || min,
    //             query.$lte || max,
    //         ])
    //     })
    // )

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

        const query: IQuery = {}
        if(logValue[0] !== min) query.$gte = Math.pow(10, logValue[0])
        if(Math.pow(10, logValue[1]) !== max) query.$lte = logValue[1] === 0 ? 0 : Math.pow(10, logValue[1])

        if(Object.keys(query).length === 0) {
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

    return (
        <div className={classes.root}>
            <Typography id='range-slider'>{title}</Typography>
            <Slider
                min={min === 0 ? 0 : Math.max(0, Math.log10(min))}
                max={Math.log10(max)}
                step={0.05}
                value={logValue}
                onChange={handleChange}
                onChangeCommitted={onChangeCommitted}
                valueLabelDisplay='auto'
                aria-labelledby='range-slider'
                valueLabelFormat={format}
            />
        </div>
    )

})) /* ============================================================================================================= */


const format = (sliderValue: number) => {
    if(sliderValue === 0) return 0

    const value = Math.round(Math.pow(10, sliderValue))

    return formatFloat(value)
}
