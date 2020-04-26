import { IBlueprint } from '@sepraisal/common'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { createSmartFC, createStyles, formatDecimal, IMyTheme } from '../../common/'
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
    const mass = sbc.blockMass

    const decoys = (sbc.blocks['Decoy/LargeDecoy'] ?? 0) + (sbc.blocks['Decoy/SmallDecoy'] ?? 0)
    const welders = (sbc.blocks['ShipWelder/LargeShipWelder'] ?? 0) + (sbc.blocks['ShipWelder/SmallShipWelder'] ?? 0)

    return (
        <>
            <MyBoxGroup height={1} width={6}>
                <MyBox variant='header'>
                    <HeaderCell title='DEFENSIVE' />
                </MyBox>
                <MyBox width={2}>
                    <ValueCell width={2} label={`Hit Points`} value={formatDecimal(sbc.blockIntegrity)} />
                </MyBox>
                <MyBox>
                    <ValueCell label={`decoys`} value={decoys || '-'} />
                </MyBox>
                <MyBox>
                    <ValueCell label={`welders`} value={welders || '-'} />
                </MyBox>
            </MyBoxGroup>
        </>
    )
})) /* ============================================================================================================= */


type ProjectionCardSbc =
    | 'blocks'
    | 'blockMass'
    | 'blockIntegrity'

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
