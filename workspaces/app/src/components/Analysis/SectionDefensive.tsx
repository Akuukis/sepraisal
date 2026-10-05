import { IBlueprint, countBlocks } from '@sepraisal/common'
import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { createSmartFC, createStyles, formatDecimal, IMyTheme } from 'src/common'
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
    const mass = sbc.blockMass

    const decoys = countBlocks(sbc.blocks, [
        'Decoy/LargeDecoy',
        'Decoy/SmallDecoy',
        'Decoy/TrussPillarDecoy',
    ])

    const welders = countBlocks(sbc.blocks, [
        'ShipWelder/LargeShipWelder',
        'ShipWelder/SmallShipWelder',
    ])

    return (
        <MySection heading='Defensive' label='Hit Points' value={formatDecimal(sbc.blockIntegrity)} className={clsx(classes.root, className)} {...otherProps}>
            <MyBoxColumn width={3}>
                <MyBoxRow width={3}>
                    <MyBox>
                        <ValueCell label={`decoys`} value={decoys || '-'} />
                    </MyBox>
                    <MyBox>
                        <ValueCell label={`welders`} value={welders || '-'} />
                    </MyBox>
                </MyBoxRow>
            </MyBoxColumn>
        </MySection>
    )
})) /* ============================================================================================================= */


type ProjectionCardSbc =
    | 'blocks'
    | 'blockMass'
    | 'blockIntegrity'

interface IBpProjectionRow {
   sbc: { [key in keyof Pick<IBlueprint.ISbc, ProjectionCardSbc>]: IBlueprint.ISbc[key] },
}
const getFixedDPS = (blocks: IBpProjectionRow['sbc']['blocks']) =>
    (150 * 700 / 60) * countBlocks(blocks, ['SmallGatlingGun/'])
   + (500 * 60 / 60) * countBlocks(blocks, ['SmallMissileLauncher/'])
   + (500 * 60 / 60) * countBlocks(blocks, ['SmallMissileLauncherReload/SmallRocketLauncherReload'])
   + (500 * 120 / 60) * countBlocks(blocks, ['SmallMissileLauncher/LargeMissileLauncher'])

const getTurretDPS = (blocks: IBpProjectionRow['sbc']['blocks']) =>
    (60 * 300 / 60) * countBlocks(blocks, ['LargeGatlingTurret/SmallGatlingTurret'])
   + (150 * 600 / 60) * countBlocks(blocks, ['LargeGatlingTurret/'])
   + (500 * 90 / 60) * countBlocks(blocks, ['LargeMissileTurret/SmallMissileTurret'])
   + (500 * 90 / 60) * countBlocks(blocks, ['LargeMissileTurret/'])
   + (30 * 600 / 60) * countBlocks(blocks, ['InteriorTurret/LargeInteriorTurret'])