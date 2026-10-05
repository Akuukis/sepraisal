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
    const sbc = bp.sbc

    const progBlocks = countBlocks(sbc.blocks, [
        'MyProgrammableBlock/LargeProgrammableBlock',
        'MyProgrammableBlock/SmallProgrammableBlock',
    ])
    const sensors = countBlocks(sbc.blocks, [
        'SensorBlock/LargeBlockSensor',
        'SensorBlock/SmallBlockSensor',
    ])
    const timers = countBlocks(sbc.blocks, [
        'TimerBlock/TimerBlockLarge',
        'TimerBlock/TimerBlockSmall',
    ])

    const projectors = countBlocks(sbc.blocks, [
        'MyObjectBuilder_Projector/LargeProjector',
        'MyObjectBuilder_Projector/SmallProjector',
    ])
    const soundBlocks = countBlocks(sbc.blocks, [
        'SoundBlock/SmallBlockSoundBlock',
        'SoundBlock/LargeBlockSoundBlock',
    ])
    const buttons = countBlocks(sbc.blocks, [
        'ButtonPanel/ButtonPanelLarge',
        'ButtonPanel/ButtonPanelSmall',
    ])
    const sorters = countBlocks(sbc.blocks, [
        'ConveyorSorter/LargeBlockConveyorSorter',
        'ConveyorSorter/MediumBlockConveyorSorter',
        'ConveyorSorter/SmallBlockConveyorSorter',
    ])
    const lcds = countBlocks(sbc.blocks, [
        'MyProgrammableBlock/LargeProgrammableBlock',
        'MyProgrammableBlock/SmallProgrammableBlock',
        'TextPanel/SmallTextPanel',
        'TextPanel/SmallLCDPanelWide',
        'TextPanel/SmallLCDPanel',
        'TextPanel/LargeBlockCorner_LCD_1',
        'TextPanel/LargeBlockCorner_LCD_2',
        'TextPanel/LargeBlockCorner_LCD_Flat_1',
        'TextPanel/LargeBlockCorner_LCD_Flat_2',
        'TextPanel/SmallBlockCorner_LCD_1',
        'TextPanel/SmallBlockCorner_LCD_2',
        'TextPanel/SmallBlockCorner_LCD_Flat_1',
        'TextPanel/SmallBlockCorner_LCD_Flat_2',
        'TextPanel/LargeTextPanel',
        'TextPanel/LargeLCDPanel',
        'TextPanel/LargeLCDPanelWide',
        'LCDPanelsBlock/LabEquipment',
        'LCDPanelsBlock/MedicalStation',
        'TextPanel/TransparentLCDLarge',
        'TextPanel/TransparentLCDSmall',
    ])

    return (
        <MySection heading='Automation' label='prog.blocks' value={progBlocks || '-'} className={clsx(classes.root, className)} {...otherProps}>
            <MyBoxColumn width={3}>
                <MyBoxRow>
                    <MyBox width={2}>
                        <ValueCell label={`projectors`} value={projectors || '-'} />
                    </MyBox>
                </MyBoxRow>
            </MyBoxColumn>
            <MyBoxColumn width={3}>
                <MyBoxRow width={3}>
                    <MyBox width={3}>
                        <ValueCell label={`LCDs`} value={lcds || '-'} />
                        <ValueCell label={`buttons`} value={buttons || '-'} />
                        <ValueCell label={`soundBlocks`} value={soundBlocks || '-'} />
                    </MyBox>
                </MyBoxRow>
            </MyBoxColumn>
            <MyBoxColumn width={3}>
                <MyBoxRow width={3}>
                    <MyBox width={3}>
                        <ValueCell label={`sensors`} value={sensors || '-'} />
                        <ValueCell label={`timers`} value={timers || '-'} />
                        <ValueCell label={`sorters`} value={sorters || '-'} />
                    </MyBox>
                </MyBoxRow>
            </MyBoxColumn>
        </MySection>
    )
})) /* ============================================================================================================= */


type ProjectionCardSbc =
    | 'blocks'

interface IBpProjectionRow {
    sbc: {[key in keyof Pick<IBlueprint.ISbc, ProjectionCardSbc>]: IBlueprint.ISbc[key]},
}
