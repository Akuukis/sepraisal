import { IBlueprint } from '@sepraisal/common'
import clsx from 'clsx'
import * as React from 'react'
import { cold } from 'react-hot-loader'
import Vega from 'react-vega'

import { createSmartFC, createStyles, IMyTheme, vegaSpecHeatmapLegend } from 'src/common'

import LegendCell from '../Cell/LegendCell'
import MyBox from '../MyBox'
import MyBoxColumn from '../MyBoxColumn'
import MyBoxRow from '../MyBoxRow'
import MySection from './MySection'
import SectionIntegrityHeatmap from './SectionIntegrityHeatmap'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },
})


interface IProps extends Omit<React.ComponentProps<typeof MySection>, 'heading' | 'value' | 'label'> {
    bp: IBpProjectionRow
    long?: boolean
}


export default cold(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {bp, className, long, ...otherProps} = props
    const {sbc} = bp

    const {top, front, side} = sbc.integrityPlanes
    const xRaw = Math.max(top[0].length, side[0].length, front[0].length) + 2
    const yRaw = Math.max(top.length, side.length, front.length) + 2
    const maxValues = {
        value: sbc.blockIntegrity / 10,
        x: Math.max(xRaw, Math.round(yRaw * theme.shape.boxWidth / (theme.shape.boxHeight * 3))),
        y: Math.max(yRaw, Math.round(xRaw * (theme.shape.boxHeight * 3) / theme.shape.boxWidth)),
    }

    return (
        <MySection
            heading='X-Ray'
            label={'grid size'}
            value={sbc.gridSize}
            className={clsx(classes.root, className)}
            {...otherProps}
            MyBoxColumnProps={{height: 3}}
            innerChildren={(<>
                <MyBoxRow height={1} width={3}>
                    <MyBox width={3}>
                        <LegendCell
                            width={3}
                            legend='At the dark spots there are more blocks with more integrity.'
                            legendProps={{noWrap: false, align: 'center'}}
                        />
                    </MyBox>
                </MyBoxRow>
                <MyBoxRow height={1} width={3}>
                    <MyBox width={3}>
                        <Vega
                            data={{
                                domain: {max: Math.sqrt(maxValues.value)},
                            }}
                            spec={vegaSpecHeatmapLegend}
                        />
                    </MyBox>
                </MyBoxRow>
            </>)}
        >
            <MyBoxColumn height={3} width={3}>
                <MyBoxRow height={3} width={3}>
                    <MyBox width={3}>
                        <SectionIntegrityHeatmap maxValues={maxValues} plane={top} />
                    </MyBox>
                </MyBoxRow>
            </MyBoxColumn>
            <MyBoxColumn height={3} width={3}>
                <MyBoxRow height={3} width={3}>
                    <MyBox width={3}>
                        <SectionIntegrityHeatmap maxValues={maxValues} plane={front} />
                    </MyBox>
                </MyBoxRow>
            </MyBoxColumn>
            <MyBoxColumn height={3} width={3}>
                <MyBoxRow height={3} width={3}>
                    <MyBox width={3}>
                        <SectionIntegrityHeatmap maxValues={maxValues} plane={side} />
                    </MyBox>
                </MyBoxRow>
            </MyBoxColumn>
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
