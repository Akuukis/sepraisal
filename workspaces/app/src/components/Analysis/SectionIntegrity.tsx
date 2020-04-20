import { IBlueprint } from '@sepraisal/common'
import * as React from 'react'
import { cold } from 'react-hot-loader'
import Vega from 'react-vega'

import { createSmartFC, createStyles, GridSize, IMyTheme } from '../../common/'
import { vegaSpecHeatmapLegend } from '../../common/vega'
import ValueCell from '../../components/Cell/ValueCell'
import HeaderCell from '../Cell/HeaderCell'
import MyBox from '../MyBox'
import MyRow from '../MyRow'
import MySection from '../MySection'
import SectionIntegrityHeatmap from './SectionIntegrityHeatmap'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },
})


interface IProps {
    bp: IBpProjectionRow
    width: GridSize
}


export default cold(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
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

    // TODO: Simplify Legend & MyBox-es.
    return (
        <MySection className={classes.root}>
            <MyBox xs style={{maxWidth: 67 * 3}}>
                <MyRow>
                    <HeaderCell title='INTEGRITY' xs={12} sm={8} />
                </MyRow>
                <MyRow>
                    <ValueCell xs={8} sm={8} label={`Total Integrity`} value={bp.sbc.blockIntegrity} />
                    <ValueCell xs={4} sm={4} label={`grid size`} value={bp.sbc.gridSize} />
                </MyRow>
                <MyRow>
                    <ValueCell xs={4} sm={4} label={`length (m)`} value={`${top[0].length * blockSize}`} />
                    <ValueCell xs={4} sm={4} label={`width (m)`} value={`${top.length * blockSize}`} />
                    <ValueCell xs={4} sm={4} label={`height (m)`} value={`${side.length * blockSize}`} />
                </MyRow>
            </MyBox>
            <MyBox xs style={{maxWidth: 67 * 1, height: 151}}>
                <Vega
                    data={{
                        domain: {max: Math.sqrt(maxValues.value)},
                    }}
                    spec={vegaSpecHeatmapLegend}
                />
            </MyBox>
            <SectionIntegrityHeatmap width={6} maxValues={maxValues} plane={top} />
            <SectionIntegrityHeatmap width={6} maxValues={maxValues} plane={front} />
            <SectionIntegrityHeatmap width={6} maxValues={maxValues} plane={side} />
        </MySection>
    )
})) /* ============================================================================================================= */


type ProjectionCardSbc =
    | 'integrityPlanes'
    | 'blockIntegrity'
    | 'gridSize'

interface IBpProjectionRow {
    sbc: {[key in keyof Pick<IBlueprint.ISbc, ProjectionCardSbc>]: IBlueprint.ISbc[key]},
}
