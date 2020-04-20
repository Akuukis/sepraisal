import { IBlueprint } from '@sepraisal/common'
import * as React from 'react'
import { cold } from 'react-hot-loader'
import Vega from 'react-vega'

import { Card, CardContent, Divider, Grid, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, GridSize, IMyTheme } from '../../common/'
import { vegaSpecHeatmapLegend } from '../../common/vega'
import ValueWithLabel from '../../components/ValueWithLabel'
import RowIntegrityHeatmap from './RowIntegrityHeatmap'
import MyRow from '../MyRow'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        padding: '0.5em',
    },

    card: {
    },
    cardContent: {
        paddingBottom: 8,
        paddingTop: 8,
    },
    cell: {
        width: '268px',
    },
    corner: {
        backgroundColor: theme.palette.secondary.main,
    },
    inline: {
        display: 'inline',
    },
})


interface IProps {
    bp: IBpProjectionRow
    width: GridSize
}


export default cold(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {
    const {bp} = props

    const {top, front, side} = bp.sbc.integrityPlanes
    const xRaw = Math.max(top[0].length, side[0].length, front[0].length) + 2
    const yRaw = Math.max(top.length, side.length, front.length) + 2
    const maxValues = {
        value: bp.sbc.blockIntegrity / 10,
        x: Math.max(xRaw, Math.round(yRaw * 268 / 151)),
        y: Math.max(yRaw, Math.round(xRaw * 151 / 268)),
    }

    const blockSize = bp.sbc.gridSize === 'Small' ? 0.5 : 2.5

    return (
        <Grid item xs={props.width}>
            <Card square className={classes.card}>
                <Grid container>
                    <Grid item xs={12} sm={6} className={classes.cell}>
                        <Grid container justify='space-between'>
                            <Grid item xs={9}>
                                <Grid container spacing={0}>
                                    <Grid item xs={12} sm={9} className={classes.corner}>
                                        <CardContent className={classes.cardContent}>
                                            <Typography variant='body1'>{`INTEGRITY`}</Typography>
                                        </CardContent>
                                        <Divider />
                                    </Grid>
                                </Grid>
                                <MyRow>
                                    <ValueWithLabel xs={8} label={`Total Integrity`} value={bp.sbc.blockIntegrity} />
                                    <ValueWithLabel xs={4} label={`grid size`} value={bp.sbc.gridSize} />
                                </MyRow>
                                <MyRow>
                                    <ValueWithLabel xs={4} label={`length (m)`} value={`${top[0].length * blockSize}`} />
                                    <ValueWithLabel xs={4} label={`width (m)`} value={`${top.length * blockSize}`} />
                                    <ValueWithLabel xs={4} label={`height (m)`} value={`${side.length * blockSize}`} />
                                </MyRow>
                            </Grid>
                            <Grid item style={{height: 151}}>
                                <Vega
                                    data={{
                                        domain: {max: Math.sqrt(maxValues.value)},
                                    }}
                                    spec={vegaSpecHeatmapLegend}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <RowIntegrityHeatmap width={6} maxValues={maxValues} plane={top} />
                    <RowIntegrityHeatmap width={6} maxValues={maxValues} plane={front} />
                    <RowIntegrityHeatmap width={6} maxValues={maxValues} plane={side} />
                </Grid>
            </Card>
        </Grid>
    )
})) /* ============================================================================================================= */


type ProjectionCardSbc =
    | 'integrityPlanes'
    | 'blockIntegrity'
    | 'gridSize'

interface IBpProjectionRow {
    sbc: {[key in keyof Pick<IBlueprint.ISbc, ProjectionCardSbc>]: IBlueprint.ISbc[key]},
}
