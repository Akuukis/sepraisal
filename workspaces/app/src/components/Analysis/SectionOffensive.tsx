import { IBlueprint } from '@sepraisal/common'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { createSmartFC, createStyles, formatDecimal, IMyTheme } from '../../common/'
import ValueCell from '../../components/Cell/ValueCell'
import LegendCell from '../Cell/LegendCell'
import MyBox from '../MyBox'
import MyBoxColumn from '../MyBoxColumn'
import MyBoxRow from '../MyBoxRow'
import MySectionInner from './MySectionInner'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },
})


interface IProps {
    bp: IBpProjectionRow
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const sbc = props.bp.sbc
    const mass = sbc.blockMass

    const warheads = {
        small: sbc.blocks['Warhead/SmallWarhead'] ?? 0,
        large: sbc.blocks['Warhead/LargeWarhead'] ?? 0,
    }
    const fixed = {
        smallGatling: sbc.blocks['SmallGatlingGun/'] ?? 0,
        smallMissile: sbc.blocks['SmallMissileLauncher/'] ?? 0,
        largeMissile: sbc.blocks['SmallMissileLauncher/LargeMissileLauncher'] ?? 0,
        smallMissileReload: sbc.blocks['SmallMissileLauncherReload/SmallRocketLauncherReload'] ?? 0,
    }
    const turret = {
        smallGatling: sbc.blocks['LargeGatlingTurret/SmallGatlingTurret'] ?? 0,
        largeGatling: sbc.blocks['LargeGatlingTurret/'] ?? 0,
        smallMissile: sbc.blocks['LargeMissileTurret/SmallMissileTurret'] ?? 0,
        largeMissile: sbc.blocks['LargeMissileTurret/'] ?? 0,
        interior: sbc.blocks['InteriorTurret/LargeInteriorTurret'] ?? 0,
    }
    const fixedDPS = getFixedDPS(sbc.blocks)
    const turretDPS = getTurretDPS(sbc.blocks)
    const totalDPS = fixedDPS + turretDPS

    return (
        <MySectionInner heading='Offensive' label='total DPS' value={formatDecimal(totalDPS)}>
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
                        <LegendCell width={2} legendProps={{align: 'right'}} legend={`Fixed Guns:`} />
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
                        <LegendCell width={2} legendProps={{align: 'right'}} legend={`Turrets:`} />
                        <ValueCell label={`turret DPS`} value={formatDecimal(turretDPS)} />
                        <ValueCell label={`gatling`} value={(turret.smallGatling + turret.largeGatling) || '-'} />
                        <ValueCell label={`rocket`} value={(turret.smallMissile + fixed.largeMissile) || '-'} />
                        <ValueCell label={`interior`} value={turret.interior || '-'} />
                    </MyBox>
                </MyBoxRow>
            </MyBoxColumn>
        </MySectionInner>
    )
})) /* ============================================================================================================= */


type ProjectionCardSbc =
    | 'blocks'
    | 'blockMass'

interface IBpProjectionRow {
    sbc: {[key in keyof Pick<IBlueprint.ISbc, ProjectionCardSbc>]: IBlueprint.ISbc[key]},
}

const getFixedDPS = (blocks: IBpProjectionRow['sbc']['blocks']) => {
    return 0
        + (150 * 700/60 * (blocks['SmallGatlingGun/'] ?? 0))
        + (500 * 60 /60 * (blocks['SmallMissileLauncher/'] ?? 0))
        + (500 * 60 /60 * (blocks['SmallMissileLauncherReload/SmallRocketLauncherReload'] ?? 0))
        + (500 * 120/60 * (blocks['SmallMissileLauncher/LargeMissileLauncher'] ?? 0))
}

const getTurretDPS = (blocks: IBpProjectionRow['sbc']['blocks']) => {
    return 0
        + (60  * 300/60 * (blocks['LargeGatlingTurret/SmallGatlingTurret'] ?? 0))
        + (150 * 600/60 * (blocks['LargeGatlingTurret/'] ?? 0))
        + (500 *  90/60 * (blocks['LargeMissileTurret/SmallMissileTurret'] ?? 0))
        + (500 *  90/60 * (blocks['LargeMissileTurret/'] ?? 0))
        + (30  * 600/60 * (blocks['InteriorTurret/LargeInteriorTurret'] ?? 0))
}
