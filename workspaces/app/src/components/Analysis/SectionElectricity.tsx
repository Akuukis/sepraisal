import { IBlueprint } from '@sepraisal/common'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { createSmartFC, createStyles, IMyTheme } from '../../common/'
import ValueCell from '../../components/Cell/ValueCell'
import HeaderCell from '../Cell/HeaderCell'
import MyBox from '../MyBox'
import MyBoxGroup from '../MyBoxGroup'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },
})


interface IProps {
    bp: IBpProjectionRow
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {sbc} = props.bp

    const maxOutput = getMaxOutput(sbc.blocks)
    const maxStorage = getMaxStorage(sbc.blocks)
    const smallReactors = (sbc.blocks['Reactor/SmallBlockSmallGenerator'] ?? 0) + (sbc.blocks['Reactor/LargeBlockSmallGenerator'] ?? 0)
    const largeReactors = (sbc.blocks['Reactor/SmallBlockLargeGenerator'] ?? 0) + (sbc.blocks['Reactor/LargeBlockLargeGenerator'] ?? 0)
    const batteries = (sbc.blocks['BatteryBlock/SmallBlockBatteryBlock'] ?? 0) + (sbc.blocks['BatteryBlock/LargeBlockBatteryBlock'] ?? 0)
    const smallBatteries = (sbc.blocks['BatteryBlock/SmallBlockSmallBatteryBlock'] ?? 0)
    const solarPanels = (sbc.blocks['SolarPanel/SmallBlockSolarPanel'] ?? 0) + (sbc.blocks['SolarPanel/LargeBlockSolarPanel'] ?? 0)
    const hydroEngine = (sbc.blocks['HydrogenEngine/SmallHydrogenEngine'] ?? 0) + (sbc.blocks['HydrogenEngine/LargeHydrogenEngine'] ?? 0)
    const windTurbines = (sbc.blocks['WindTurbine/LargeBlockWindTurbine'] ?? 0)

    return (
        <>
            <MyBoxGroup height={2} width={6}>
                <MyBox width={2} flat>
                    <HeaderCell title='ELECTRICITY' />
                </MyBox>
                <MyBox width={1}>
                    <ValueCell label={`max output (MW)`} value={maxOutput || '-'} />
                </MyBox>
                <MyBox width={3}>
                    <ValueCell label={`capacity (MWh)`} value={maxStorage || '-'} />
                    <ValueCell label={`batteries`} value={batteries || '-'} />
                    <ValueCell label={`small batteries`} value={smallBatteries || '-'} />
                </MyBox>
                <MyBox width={3}>
                    <ValueCell label={`small reactors`} value={smallReactors || '-'} />
                    <ValueCell label={`large reactors`} value={largeReactors || '-'} />
                </MyBox>
                <MyBox width={3}>
                    <ValueCell label={`hydro engines`} value={hydroEngine || '-'} />
                    <ValueCell label={`solar panels`} value={solarPanels || '-'} />
                    <ValueCell label={`wind turbines`} value={windTurbines || '-'} />
                </MyBox>
            </MyBoxGroup>
        </>
    )
})) /* ============================================================================================================= */


type ProjectionCardSbc =
    | 'blocks'

interface IBpProjectionRow {
    sbc: {[key in keyof Pick<IBlueprint.ISbc, ProjectionCardSbc>]: IBlueprint.ISbc[key]},
}

const getMaxOutput = (blocks: IBpProjectionRow['sbc']['blocks']) => {
    return 0
        +   0.5  * (blocks['Reactor/SmallBlockSmallGenerator'] ?? 0)
        +  14.75 * (blocks['Reactor/SmallBlockLargeGenerator'] ?? 0)
        +   4    * (blocks['BatteryBlock/SmallBlockBatteryBlock'] ?? 0)
        +   0.2  * (blocks['BatteryBlock/SmallBlockSmallBatteryBlock'] ?? 0)
        +   0.04 * (blocks['SolarPanel/SmallBlockSolarPanel'] ?? 0)
        +   0.5  * (blocks['HydrogenEngine/SmallHydrogenEngine'] ?? 0)
        +  15    * (blocks['Reactor/LargeBlockSmallGenerator'] ?? 0)
        + 300    * (blocks['Reactor/LargeBlockLargeGenerator'] ?? 0)
        +  12    * (blocks['BatteryBlock/LargeBlockBatteryBlock'] ?? 0)
        +   0.16 * (blocks['SolarPanel/LargeBlockSolarPanel'] ?? 0)
        +   5.0  * (blocks['HydrogenEngine/LargeHydrogenEngine'] ?? 0)
}

const getMaxStorage = (blocks: IBpProjectionRow['sbc']['blocks']) => {
    return 0
        +   1    * (blocks['BatteryBlock/SmallBlockBatteryBlock'] ?? 0)
        +   0.05 * (blocks['BatteryBlock/SmallBlockSmallBatteryBlock'] ?? 0)
        +   3    * (blocks['BatteryBlock/LargeBlockBatteryBlock'] ?? 0)
}
