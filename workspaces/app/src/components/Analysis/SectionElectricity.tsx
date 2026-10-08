import { IBlueprint, countBlocks } from '@sepraisal/common'
import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import ValueCell from 'src/components/Cell/ValueCell'

import MyBox from '../MyBox'
import MyBoxColumn from '../MyBoxColumn'
import MyBoxRow from '../MyBoxRow'
import MySection from './MySection'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },
})


interface IProps extends Omit<React.ComponentProps<typeof MySection>, 'heading' | 'value' | 'label'> {
    bp: IBpProjectionRow
    long?: boolean
}


export default hot(createSmartFC(styles, __filename)<IProps>(({ children, classes, theme, ...props }) => {
    const { bp, className, long, ...otherProps } = props
    const { sbc } = bp

    const maxOutput = getMaxOutput(sbc.blocks)
    const maxStorage = getMaxStorage(sbc.blocks)

    const smallReactors = countBlocks(sbc.blocks, [
        'Reactor/SmallBlockSmallGenerator',
        'Reactor/SmallBlockSmallGeneratorWarfare2',
        'Reactor/LargeBlockSmallGenerator',
        'Reactor/LargeBlockSmallGeneratorWarfare2',
    ])
    const largeReactors = countBlocks(sbc.blocks, [
        'Reactor/SmallBlockLargeGenerator',
        'Reactor/SmallBlockLargeGeneratorWarfare2',
        'Reactor/LargeBlockLargeGenerator',
        'Reactor/LargeBlockLargeGeneratorWarfare2',
    ])
    const batteries = countBlocks(sbc.blocks, [
        'BatteryBlock/SmallBlockBatteryBlock',
        'BatteryBlock/SmallBlockBatteryBlockWarfare2',
        'BatteryBlock/LargeBlockBatteryBlock',
        'BatteryBlock/LargeBlockBatteryBlockWarfare2',
        'BatteryBlock/LargeBlockBatteryReskin',
        'BatteryBlock/LargeBlockBatteryReskinOffset',
        'BatteryBlock/SmallBlockBatteryReskin',
        'BatteryBlock/LargeBlockPrototechBattery',
        'BatteryBlock/SmallBlockPrototechBattery',
    ])
    const smallBatteries = countBlocks(sbc.blocks, [
        'BatteryBlock/SmallBlockSmallBatteryBlock',
    ])
    const solarPanels = countBlocks(sbc.blocks, [
        'SolarPanel/LargeBlockSolarPanel',
        'SolarPanel/SmallBlockSolarPanel',
        'SolarPanel/LargeBlockColorableSolarPanel',
        'SolarPanel/LargeBlockColorableSolarPanelCorner',
        'SolarPanel/LargeBlockColorableSolarPanelCornerInverted',
        'SolarPanel/SmallBlockColorableSolarPanel',
        'SolarPanel/SmallBlockColorableSolarPanelCorner',
        'SolarPanel/SmallBlockColorableSolarPanelCornerInverted',
    ])
    const hydroEngine = countBlocks(sbc.blocks, [
        'HydrogenEngine/LargeHydrogenEngine',
        'HydrogenEngine/SmallHydrogenEngine',
        'HydrogenEngine/LargeHydrogenEngineReskin',
        'HydrogenEngine/SmallHydrogenEngineReskin',
        'HydrogenEngine/LargePrototechReactor',
    ])
    const windTurbines = countBlocks(sbc.blocks, [
        'WindTurbine/LargeBlockWindTurbine',
        'WindTurbine/LargeBlockWindTurbineReskin',
    ])

    return (
        <MySection heading='Electricity' label='max output (MW)' value={maxOutput || '-'} className={clsx(classes.root, className)} {...otherProps}>
            <MyBoxColumn width={3}>
                <MyBoxRow width={3}>
                    <MyBox width={3}>
                        <ValueCell label={`capacity (MWh)`} value={maxStorage || '-'} />
                        <ValueCell label={`batteries`} value={batteries || '-'} />
                        <ValueCell label={`small batteries`} value={smallBatteries || '-'} />
                    </MyBox>
                </MyBoxRow>
            </MyBoxColumn>
            <MyBoxColumn width={6}>
                <MyBoxRow width={6}>
                    <MyBox width={3}>
                        <ValueCell label={`small reactors`} value={smallReactors || '-'} />
                        <ValueCell label={`large reactors`} value={largeReactors || '-'} />
                    </MyBox>
                    <MyBox width={3}>
                        <ValueCell label={`hydro engines`} value={hydroEngine || '-'} />
                        <ValueCell label={`solar panels`} value={solarPanels || '-'} />
                        <ValueCell label={`wind turbines`} value={windTurbines || '-'} />
                    </MyBox>
                </MyBoxRow>
            </MyBoxColumn>
        </MySection>
    )
})) /* ============================================================================================================= */


type ProjectionCardSbc =
   | 'blocks'

interface IBpProjectionRow {
   sbc: { [key in keyof Pick<IBlueprint.ISbc, ProjectionCardSbc>]: IBlueprint.ISbc[key] },
}
const getMaxOutput = (blocks: IBpProjectionRow['sbc']['blocks']) =>
    0.5 * countBlocks(blocks, ['Reactor/SmallBlockSmallGenerator'])
   + 14.75 * countBlocks(blocks, ['Reactor/SmallBlockLargeGenerator'])
   + 12 * countBlocks(blocks, [
       'BatteryBlock/LargeBlockBatteryBlock',
       'BatteryBlock/LargeBlockBatteryBlockWarfare2',
   ])
   + 6 * countBlocks(blocks, [
       'BatteryBlock/LargeBlockBatteryReskin',
       'BatteryBlock/LargeBlockBatteryReskinOffset',
   ])
   + 48 * countBlocks(blocks, [
       'BatteryBlock/LargeBlockPrototechBattery',
   ])
   + 4 * countBlocks(blocks, [
       'BatteryBlock/SmallBlockBatteryBlock',
       'BatteryBlock/SmallBlockBatteryBlockWarfare2',
       'BatteryBlock/SmallBlockBatteryReskin',
   ])
   + 2.8 * countBlocks(blocks, ['BatteryBlock/SmallBlockPrototechBattery',])
   + 0.2 * countBlocks(blocks, ['BatteryBlock/SmallBlockSmallBatteryBlock'])
   + 0.04 * countBlocks(blocks, ['SolarPanel/SmallBlockSolarPanel'])
   + 0.5 * countBlocks(blocks, ['HydrogenEngine/SmallHydrogenEngine'])
   + 15 * countBlocks(blocks, ['Reactor/LargeBlockSmallGenerator'])
   + 300 * countBlocks(blocks, ['Reactor/LargeBlockLargeGenerator'])
   + 12 * countBlocks(blocks, ['BatteryBlock/LargeBlockBatteryBlock'])
   + 0.16 * countBlocks(blocks, ['SolarPanel/LargeBlockSolarPanel'])
   + 5.0 * countBlocks(blocks, ['HydrogenEngine/LargeHydrogenEngine'])

const getMaxStorage = (blocks: IBpProjectionRow['sbc']['blocks']) =>
    3 * countBlocks(blocks, [
        'BatteryBlock/LargeBlockBatteryBlock',
        'BatteryBlock/LargeBlockBatteryBlockWarfare2',
    ])
   + 1.5 * countBlocks(blocks, [
       'BatteryBlock/LargeBlockBatteryReskin',
       'BatteryBlock/LargeBlockBatteryReskinOffset',
   ])
   + 18 * countBlocks(blocks, [
       'BatteryBlock/LargeBlockPrototechBattery',
   ])
   + 1 * countBlocks(blocks, [
       'BatteryBlock/SmallBlockBatteryBlock',
       'BatteryBlock/SmallBlockBatteryBlockWarfare2',
       'BatteryBlock/SmallBlockBatteryReskin',
   ])
   + 2 * countBlocks(blocks, ['BatteryBlock/SmallBlockPrototechBattery',])
   + 0.05 * countBlocks(blocks, ['BatteryBlock/SmallBlockSmallBatteryBlock'])