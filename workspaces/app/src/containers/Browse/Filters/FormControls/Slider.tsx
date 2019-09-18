import { action } from 'mobx'
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
    step?: number,
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

    const [value, setValue] = React.useState([min, max])

    const handleChange = (event, newValue) => {
        setValue(newValue)
    }

    // React.useEffect(() => {
    //     const index = cardStore.find.$and.findIndex((obj) => Object.keys(obj).pop()! === findKey)
    //     const query: IQuery = index === -1 ? {} : cardStore.find.$and[index]

    //     setLogValue([
    //         query.$gte || min,
    //         query.$lte || max,
    //     ])

    // }, [cardStore.find])

    const onChangeCommitted = action(() => {
        // tslint:disable-next-line: no-non-null-assertion
        const index = cardStore.find.$and.findIndex((obj) => Object.keys(obj).pop()! === findKey)
        const before = cardStore.find.$and.slice(0, Math.max(0, index))
        const after = cardStore.find.$and.slice(index + 1, cardStore.find.$and.length)

        if(zeroes !== undefined && value[0] === 0 && value[1] === 0) {
            cardStore.setFind({$and: [
                ...before,
                {[findKey]: zeroes},
                ...after,
            ]})

            return
        }

        const query: IQuery = {}
        if(value[0] !== min) query.$gte = value[0]
        if(value[1] !== max) query.$lte = value[1]

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
                min={min}
                max={max}
                step={1}
                value={value}
                onChange={handleChange}
                onChangeCommitted={onChangeCommitted}
                valueLabelDisplay='auto'
                aria-labelledby='range-slider'
                valueLabelFormat={formatFloat}
            />
        </div>
    )

})) /* ============================================================================================================= */
