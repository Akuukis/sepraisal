import { noop } from '@sepraisal/common'
import * as React from 'react'
import { cold } from 'react-hot-loader'
import Vega from 'react-vega'

import { Card, Grid } from '@material-ui/core'

import { createSmartFC, createStyles, GridSize, IMyTheme } from '../../common/'
import { vegaSpecHeatmap } from '../../common/vega'
import MyBox from '../MyBox'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        height: 151,
    },
})


interface IProps {
    maxValues: {
        value: number,
        x: number,
        y: number,
    }
    plane: number[][]
    width: GridSize
}


export default cold(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    // const [svg, setSvg] = React.useState(<svg />)

    // useAsyncEffectOnce(async () => {
    //     const spec = getVegaSpec(props.plane, props.maxValue)
    //     const view = new vega.View(vega.parse(spec), {
    //         container: `.${classes.card}`,
    //         hover: true,
    //         renderer: 'svg',
    //     })
    //     await view.runAsync()
    // })

    return (
        <MyBox className={classes.root}>
            <Vega
                data={{
                    integrity0: props.plane.map((line) => ({data: line})),
                    max: {
                        value: Math.sqrt(props.maxValues.value),
                        x: props.maxValues.x,
                        y: props.maxValues.y,
                    },
                }}
                spec={vegaSpecHeatmap}
                onSignalHover={noop}
            />
        </MyBox>
    )
})) /* ============================================================================================================= */
