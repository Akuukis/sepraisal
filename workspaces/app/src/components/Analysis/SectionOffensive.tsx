import { IBlueprint, countBlocks } from '@sepraisal/common'
import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { createSmartFC, createStyles, formatDecimal, IMyTheme } from 'src/common'
import ValueCell from 'src/components/Cell/ValueCell'

import LegendCell from '../Cell/LegendCell'
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

    const warheads = {
        small: countBlocks(sbc.blocks, [
            'Warhead/SmallWarhead',
        ]),
        large: countBlocks(sbc.blocks, [
            'Warhead/LargeWarhead',
        ]),
    }

    const fixed = {
        smallGatling: countBlocks(sbc.blocks, [
            'SmallGatlingGun/',
        ]),
        smallMissile: countBlocks(sbc.blocks, [
            'SmallMissileLauncher/',
        ]),
        largeMissile: countBlocks(sbc.blocks, [
            'SmallMissileLauncher/LargeMissileLauncher',
        ]),
        smallMissileReload: countBlocks(sbc.blocks, [
            'SmallMissileLauncherReload/SmallRocketLauncherReload',
        ]),
    }

    const turret = {
        smallGatling: countBlocks(sbc.blocks, [
            'LargeGatlingTurret/SmallGatlingTurret',
        ]),
        largeGatling: countBlocks(sbc.blocks, [
            'LargeGatlingTurret/',
        ]),
        smallMissile: countBlocks(sbc.blocks, [
            'LargeMissileTurret/SmallMissileTurret',
        ]),
        largeMissile: countBlocks(sbc.blocks, [
            'LargeMissileTurret/',
        ]),
        interior: countBlocks(sbc.blocks, [
            'InteriorTurret/LargeInteriorTurret',
        ]),
    }
    const fixedDPS = getFixedDPS(sbc.blocks)
    const turretDPS = getTurretDPS(sbc.blocks)
    const totalDPS = fixedDPS + turretDPS

    return (
        <MySection heading='Offensive' label='total DPS' value={formatDecimal(totalDPS)} className={clsx(classes.root, className)} {...otherProps}>
            <MyBoxColumn width={3}>
                <MyBoxRow width={3}>
                    <MyBox width={3}>
                        <ValueCell label={`warheads`} value={(warheads.small + warheads.large) || '-'} />
                        {/* <ValueCell label={`PMM`} value={'?'} /> */}
                        {/* <ValueCell label={`gravity gun`} value={'?'} /> */}
                    </MyBox>
                </MyBoxRow>
            </MyBoxColumn>
            <MyBoxColumn>
                <MyBoxRow width={6}>
                    <MyBox width={6}>
                        <LegendCell width={2} legendProps={{ align: 'right' }} legend={`Fixed Guns:`} />
                        <ValueCell label={`fixed DPS`} value={formatDecimal(fixedDPS)} />
                        <ValueCell label={`gatling`} value={fixed.smallGatling || '-'} />
                        <ValueCell label={`rocket`} value={(fixed.smallMissile + fixed.largeMissile) || '-'} />
                        <ValueCell label={`rel. rocket`} value={fixed.smallMissileReload || '-'} />
                    </MyBox>
                </MyBoxRow>
            </MyBoxColumn>
            <MyBoxColumn>
                <MyBoxRow width={6}>
                    <MyBox width={6}>
                        <LegendCell width={2} legendProps={{ align: 'right' }} legend={`Turrets:`} />
                        <ValueCell label={`turret DPS`} value={formatDecimal(turretDPS)} />
                        <ValueCell label={`gatling`} value={(turret.smallGatling + turret.largeGatling) || '-'} />
                        <ValueCell label={`rocket`} value={(turret.smallMissile + turret.largeMissile) || '-'} />
                        <ValueCell label={`interior`} value={turret.interior || '-'} />
                    </MyBox>
                </MyBoxRow>
            </MyBoxColumn>
        </MySection>
    )
})) /* ============================================================================================================= */


type ProjectionCardSbc =
    | 'blocks'
    | 'blockMass'

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