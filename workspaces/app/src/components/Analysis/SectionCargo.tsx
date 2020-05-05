import { IBlueprint } from '@sepraisal/common'
import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { createSmartFC, createStyles, formatDecimal, IMyTheme } from '../../common/'
import ValueCell from '../../components/Cell/ValueCell'
import { CONTEXT } from '../../stores'
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


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {bp, className, long, ...otherProps} = props
    const {sbc} = bp

    const praisalManager = React.useContext(CONTEXT.PRAISAL_MANAGER)

    // Taken from wiki
    const spendRateLarge = 1670 / 9
    const spendRateSmall = 830 / 9
    const iceToGas = 9
    const ammoVolume = 16  // TODO: praisalManager.?.get(`Component/NATO_25x184mmMagazine`)!.volume
    const missileVolume = 60  // TODO: praisalManager.?.get(`Component/Missile200mm`)!.volume

    const oreVolume = praisalManager.ores.get(`Ore/Ice`)!.volume

    const anyVolume = getVolumeAny(sbc.blocks)
    const miscVolume = getVolumeMisc(sbc.blocks)
    const oreTotalVolume = getVolumeOre(sbc.blocks)
    const iceTotalVolume = getVolumeIce(sbc.blocks)
    const ammoTotalVolume = getVolumeAmmo(sbc.blocks)
    const missileTotalVolume = getVolumeMissile(sbc.blocks)
    const totalItemVolume =
        + anyVolume
        + miscVolume
        + iceTotalVolume
        + ammoTotalVolume
        + missileTotalVolume

    const ammo = ammoTotalVolume / ammoVolume
    const missiles = missileTotalVolume / missileVolume
    const ice = iceTotalVolume / oreVolume
    const ammoContainersPotential = Math.floor(anyVolume / ammoVolume)
    const missilesPotential = Math.floor(anyVolume / missileVolume)
    const orePotential = Math.floor(anyVolume / oreVolume)

    const stellPlatePotential = Math.floor(anyVolume / 3)
    const constructionCompPotential = Math.floor(anyVolume / 2)
    const ironIngotPotential = Math.floor(anyVolume / 0.127)


    const totalOxygen = getTotalOxygen(sbc.blocks)
    const totalHydrogen = getTotalHydrogen(sbc.blocks)
    const generators = (sbc.blocks['OxygenGenerator/'] ?? 0) + (sbc.blocks['OxygenGenerator/OxygenGeneratorSmall'] ?? 0)

    const gasExtra = generators && iceToGas * ice
    const gasPotentialExtra = generators && iceToGas * orePotential


    return (
        <MySection
            heading='Cargo Capacity'
            label='total cargo (l)'
            value={formatDecimal(totalItemVolume)}
            MyBoxColumnProps={{height: 4}}
            className={clsx(classes.root, className)}
            {...otherProps}
            innerChildren={(
                <MyBoxRow height={3} width={3}>
                    <MyBox width={3}>
                        <LegendCell legend='Breakdown' legendProps={{align: 'center'}} />
                        <ValueCell label='universal (l)' value={anyVolume ? formatDecimal(anyVolume) : '-'} />
                        <ValueCell label='misc (l)' value={miscVolume ? formatDecimal(miscVolume) : '-'} />
                        <ValueCell label='ores (kg)' value={oreTotalVolume ? formatDecimal(oreTotalVolume) : '-'} />
                        <ValueCell label='ammo (pc)' value={ammo ? formatDecimal(ammo) : '-'} />
                        <ValueCell label='missiles (pc)' value={missiles ? formatDecimal(missiles) : '-'} />
                        <ValueCell label='ice (kg)' value={ice ? formatDecimal(ice) : '-'} />
                        <ValueCell label='oxygen gas (l)' value={totalOxygen ? formatDecimal(totalOxygen) : '-'} />
                        <ValueCell label='hydrogen gas (l)' value={totalHydrogen ? formatDecimal(totalHydrogen) : '-'} />
                    </MyBox>
                </MyBoxRow>
            )}
        >
            <MyBoxColumn height={4} width={3}>
                <MyBoxRow height={3} width={3}>
                    <MyBox width={3}>
                        <LegendCell padded width={3} legend='Universal&nbsp;Cargo in&nbsp;terms&nbsp;of&nbsp;various&nbsp;examples' legendProps={{noWrap: false, align: 'center'}} />
                        <ValueCell label='ammo (pc)' value={ammoContainersPotential ? `+${formatDecimal(ammoContainersPotential)}` : '-'} />
                        <ValueCell label='missiles (pc)' value={missilesPotential ? `+${formatDecimal(missilesPotential)}` : '-'} />
                        <ValueCell label='ore/ice (kg)' value={orePotential ? `+${formatDecimal(orePotential)}` : '-'} />
                        <ValueCell label='steel plates (pc)' value={stellPlatePotential ? `+${formatDecimal(stellPlatePotential)}` : '-'} />
                        <ValueCell label='constr.comp. (pc)' value={constructionCompPotential ? `+${formatDecimal(constructionCompPotential)}` : '-'} />
                        <ValueCell label='iron ingots (kg)' value={ironIngotPotential ? `+${formatDecimal(ironIngotPotential)}` : '-'} />
                    </MyBox>
                </MyBoxRow>
                <MyBoxRow height={1} width={3}>
                    <MyBox width={3}>
                        <LegendCell legend='Generators produce gas' legendProps={{noWrap: false, align: 'right'}} />
                        <ValueCell label='from ice (l)' value={gasExtra ? `${formatDecimal(gasExtra)}` : '-'} />
                        <ValueCell label='from extra ice (l)' value={gasPotentialExtra ? `+${formatDecimal(gasPotentialExtra)}` : '-'} />
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

interface IBlock {
    type: keyof IBlueprint.ISbc['blocks']
    amount: number
}

const blocks = (blockMap: IBlueprint.ISbc['blocks']): IBlock[] => Object.entries(blockMap)
    .map(([type, amount]) => ({type, amount}))

const getTotalOxygen = (blockMap: IBlueprint.ISbc['blocks']) => blocks(blockMap).reduce((sum, block) => sum + (STORAGE_OXYGEN[block.type] || 0) * block.amount, 0)
const getTotalHydrogen = (blockMap: IBlueprint.ISbc['blocks']) => blocks(blockMap).reduce((sum, block) => sum + (STORAGE_HYDROGEN[block.type] || 0) * block.amount, 0)
const getVolumeAny = (blockMap: IBlueprint.ISbc['blocks']) => blocks(blockMap).reduce((sum, block) => sum + (STORAGE_ANY[block.type] || 0) * block.amount, 0)
const getVolumeMisc = (blockMap: IBlueprint.ISbc['blocks']) => blocks(blockMap).reduce((sum, block) => sum + (STORAGE_MISC[block.type] || 0) * block.amount, 0)
const getVolumeOre = (blockMap: IBlueprint.ISbc['blocks']) => blocks(blockMap).reduce((sum, block) => sum + (STORAGE_ORE[block.type] || 0) * block.amount, 0)
const getVolumeIce = (blockMap: IBlueprint.ISbc['blocks']) => blocks(blockMap).reduce((sum, block) => sum + (STORAGE_ICE[block.type] || 0) * block.amount, 0)
const getVolumeAmmo = (blockMap: IBlueprint.ISbc['blocks']) => blocks(blockMap).reduce((sum, block) => sum + (STORAGE_AMMO[block.type] || 0) * block.amount, 0)
const getVolumeMissile = (blockMap: IBlueprint.ISbc['blocks']) => blocks(blockMap).reduce((sum, block) => sum + (STORAGE_MISSILE[block.type] || 0) * block.amount, 0)

const STORAGE_OXYGEN = {
  "OxygenTank/": 100000,
  "OxygenTank/OxygenTankSmall": 50000,
  "Cockpit/LargeBlockCockpit": 60,
  "Cockpit/SmallBlockCockpit": 60,
  "Cockpit/DBSmallBlockFighterCockpit": 60,
} as const

const STORAGE_HYDROGEN = {
  "OxygenTank/LargeHydrogenTank": 5000000,
  "OxygenTank/SmallHydrogenTank": 160000,
  "OxygenTank/LargeHydrogenTankSmall": 350000,
  "OxygenTank/SmallHydrogenTankSmall": 7000,
} as const

const STORAGE_ANY = {
  "CargoContainer/SmallBlockSmallContainer": 125,
  "CargoContainer/SmallBlockMediumContainer": 3375,
  "CargoContainer/SmallBlockLargeContainer": 15625,
  "CargoContainer/LargeBlockSmallContainer": 15625,
  "CargoContainer/LargeBlockLargeContainer": 421875,
  "Collector/Collector": 1575,
  "Collector/CollectorSmall": 1575,
  "ShipConnector/Connector": 8000,
  "ShipConnector/ConnectorMedium": 1152,
} as const

const STORAGE_MISC = {
  "InteriorTurret/LargeInteriorTurret": 384,
  "Refinery/LargeRefinery": 7500,
  "Refinery/Blast Furnace": 4000,
  "Assembler/LargeAssembler": 4000,
  "Assembler/BasicAssembler": 2000,
  "SurvivalKit/SurvivalKitLarge": 2000,
  "SurvivalKit/SurvivalKit": 1000,
  "ShipGrinder/LargeShipGrinder": 31250,
  "ShipGrinder/SmallShipGrinder": 6750,
  "ShipWelder/LargeShipWelder": 31250,
  "ShipWelder/SmallShipWelder": 6750,
}

const STORAGE_ORE = {
  "Drill/LargeBlockDrill": 23437.50,
  "Drill/SmallBlockDrill": 3375,
}

const STORAGE_ICE = {
  "OxygenGenerator/": 4000,
  "OxygenGenerator/OxygenGeneratorSmall": 1000,
}

const STORAGE_AMMO = {
  "LargeGatlingTurret/": 384,
  "LargeGatlingTurret/SmallGatlingTurret": 84,
  "SmallGatlingGun/": 64,
}

const STORAGE_MISSILE = {
  "LargeMissileTurret/": 384,
  "LargeMissileTurret/SmallMissileTurret": 120,
  "SmallMissileLauncher/": 240,
  "SmallMissileLauncher/LargeMissileLauncher": 1140,
  "SmallMissileLauncherReload/SmallRocketLauncherReload": 240,
}
