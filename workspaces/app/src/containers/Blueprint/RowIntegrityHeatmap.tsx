import { noop } from '@sepraisal/common'
import * as React from 'react'
import { cold } from 'react-hot-loader'
import Vega from 'react-vega'

import { Card, Grid } from '@material-ui/core'

import { createSmartFC, createStyles, GridSize, IMyTheme } from '../../common/'
import { vegaSpecHeatmap } from '../../common/vega'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        width: '268px',
    },

    card: {
        height: '151px',
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


export default cold(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {
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
        <Grid item xs={12} sm={6} className={classes.root}>
            <Card square className={classes.card} elevation={0}>
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
            </Card>
        </Grid>
    )
})) /* ============================================================================================================= */
