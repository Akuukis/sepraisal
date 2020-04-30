import { IBlueprint } from '@sepraisal/common'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { createSmartFC, createStyles, IMyTheme } from '../../common/'
import ValueCell from '../../components/Cell/ValueCell'
import HeaderCell from '../Cell/HeaderCell'
import MyBox from '../MyBox'
import MyBoxColumn from '../MyBoxColumn'
import MyBoxRow from '../MyBoxRow'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },
})


interface IProps {
    bp: IBpProjectionRow
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {sbc} = props.bp

    const remotes = (sbc.blocks['RemoteControl/LargeBlockRemoteControl'] ?? 0) + (sbc.blocks['RemoteControl/SmallBlockRemoteControl'] ?? 0)
    const cameras = (sbc.blocks['CameraBlock/SmallCameraBlock'] ?? 0) + (sbc.blocks['CameraBlock/LargeCameraBlock'] ?? 0)
    const oreDetectors = (sbc.blocks['OreDetector/LargeOreDetector'] ?? 0) + (sbc.blocks['OreDetector/SmallBlockOreDetector'] ?? 0)
    const landingGears = (sbc.blocks['LandingGear/LargeBlockLandingGear'] ?? 0) + (sbc.blocks['LandingGear/SmallBlockLandingGear'] ?? 0)
    const beacons = (sbc.blocks['Beacon/LargeBlockBeacon'] ?? 0) + (sbc.blocks['Beacon/SmallBlockBeacon'] ?? 0)
    const radioAntennas = (sbc.blocks['RadioAntenna/LargeBlockRadioAntenna'] ?? 0) + (sbc.blocks['RadioAntenna/SmallBlockRadioAntenna'] ?? 0)
    const laserAntenna = (sbc.blocks['LaserAntenna/LargeBlockLaserAntenna'] ?? 0) + (sbc.blocks['LaserAntenna/SmallBlockLaserAntenna'] ?? 0)
    const spotlights = (sbc.blocks['ReflectorLight/LargeBlockFrontLight'] ?? 0) + (sbc.blocks['ReflectorLight/SmallBlockFrontLight'] ?? 0)

    const medical = (sbc.blocks['MedicalRoom/LargeMedicalRoom'] ?? 0)
    const cryoChambers = (sbc.blocks['CryoChamber/LargeBlockCryoChamber'] ?? 0) + (sbc.blocks['CryoChamber/SmallBlockCryoChamber'] ?? 0)
    const survivalKits = (sbc.blocks['SurvivalKit/SurvivalKitLarge'] ?? 0) + (sbc.blocks['SurvivalKit/SurvivalKit'] ?? 0)
    const airVents = (sbc.blocks['AirVent/'] ?? 0) + (sbc.blocks['AirVent/SmallAirVent'] ?? 0)
    const oxygenTanks = (sbc.blocks['OxygenTank/OxygenTankSmall'] ?? 0) + (sbc.blocks['OxygenTank/'] ?? 0)
    const oxygenFarm = (sbc.blocks['OxygenFarm/LargeBlockOxygenFarm'] ?? 0)

    const oxygenGenerator = (sbc.blocks['OxygenGenerator/'] ?? 0) + (sbc.blocks['OxygenGenerator/OxygenGeneratorSmall'] ?? 0)
    const hydrogenTanks = (sbc.blocks['OxygenTank/LargeHydrogenTank'] ?? 0) + (sbc.blocks['OxygenTank/SmallHydrogenTank'] ?? 0)

    const connectors = (sbc.blocks['ShipConnector/Connector'] ?? 0) + (sbc.blocks['ShipConnector/ConnectorMedium'] ?? 0)
    const ejectors = (sbc.blocks['ShipConnector/Connector'] ?? 0)

    const virtualMass = (sbc.blocks['VirtualMass/VirtualMassLarge'] ?? 0) + (sbc.blocks['VirtualMass/VirtualMassSmall'] ?? 0)
    const gravityGen = (sbc.blocks['GravityGenerator/'] ?? 0) + (sbc.blocks['GravityGeneratorSphere/'] ?? 0)
    const mergeBlocks = (sbc.blocks['MergeBlock/LargeShipMergeBlock'] ?? 0) + (sbc.blocks['MergeBlock/SmallShipMergeBlock'] ?? 0)

    const lights = 0
        + (sbc.blocks["InteriorLight/SmallLight"] ?? 0)
        + (sbc.blocks["InteriorLight/SmallBlockSmallLight"] ?? 0)
        + (sbc.blocks["InteriorLight/LargeBlockLight_1corner"] ?? 0)
        + (sbc.blocks["InteriorLight/LargeBlockLight_2corner"] ?? 0)
        + (sbc.blocks["InteriorLight/SmallBlockLight_1corner"] ?? 0)
        + (sbc.blocks["InteriorLight/SmallBlockLight_2corner"] ?? 0)
    const cockpits = 0
        + (sbc.blocks["Cockpit/LargeBlockCockpit"] ?? 0)
        + (sbc.blocks["Cockpit/LargeBlockCockpitSeat"] ?? 0)
        + (sbc.blocks["Cockpit/SmallBlockCockpit"] ?? 0)
        + (sbc.blocks["Cockpit/DBSmallBlockFighterCockpit"] ?? 0)
        + (sbc.blocks["Cockpit/CockpitOpen"] ?? 0)
        + (sbc.blocks["Cockpit/OpenCockpitSmall"] ?? 0)
        + (sbc.blocks["Cockpit/SmallBlockCockpitIndustrial"] ?? 0)
        + (sbc.blocks["Cockpit/LargeBlockCockpitIndustrial"] ?? 0)

    return (
        <>
            <MyBoxColumn height={4} width={6}>
                <MyBoxRow height={4} width={6}>
                    <MyBox variant='header'>
                        <HeaderCell title='UTILITIES' />
                    </MyBox>
                    <MyBox width={2}>
                        <ValueCell label='cockpits' value={cockpits || '-'} />
                        <ValueCell label='remotes' value={remotes || '-'} />
                    </MyBox>
                    <MyBox width={2}>
                        <ValueCell label='cameras' value={cameras || '-'} />
                        <ValueCell label='ore detectors' value={oreDetectors || '-'} />
                    </MyBox>
                    <MyBox width={3}>
                        <ValueCell label='landing gears' value={landingGears || '-'} />
                        <ValueCell label='connectors' value={connectors || '-'} />
                        <ValueCell label='merge blocks' value={mergeBlocks || '-'} />
                    </MyBox>
                    <MyBox width={3}>
                        <ValueCell label='beacons' value={beacons || '-'} />
                        <ValueCell label='radio antennas' value={radioAntennas || '-'} />
                        <ValueCell label='laser antennas' value={laserAntenna || '-'} />
                    </MyBox>
                    <MyBox width={3}>
                        <ValueCell label='medical' value={medical || '-'} />
                        <ValueCell label='cryo chambers' value={cryoChambers || '-'} />
                        <ValueCell label='survival kits' value={survivalKits || '-'} />
                    </MyBox>
                    <MyBox width={1}>
                        <ValueCell label='ejectors' value={ejectors || '-'} />
                    </MyBox>
                    <MyBox width={2}>
                        <ValueCell label='spotlights' value={spotlights || '-'} />
                        <ValueCell label='lights' value={lights || '-'} />
                    </MyBox>
                    <MyBox width={4}>
                        <ValueCell label='air vents' value={airVents || '-'} />
                        <ValueCell label='oxygen tanks' value={oxygenTanks || '-'} />
                        {/* <ValueCell label='oxygen farm' value={oxygenFarm || '-'} /> */}
                        <ValueCell label='oxygen generator' value={oxygenGenerator || '-'} />
                        <ValueCell label='hydrogen tanks' value={hydrogenTanks || '-'} />
                    </MyBox>
                    <MyBox width={2}>
                        <ValueCell label='virtual mass' value={virtualMass || '-'} />
                        <ValueCell label='gravity gen.' value={gravityGen || '-'} />
                    </MyBox>
                </MyBoxRow>
            </MyBoxColumn>
        </>
    )
})) /* ============================================================================================================= */


type ProjectionCardSbc =
    | 'blocks'

interface IBpProjectionRow {
    sbc: {[key in keyof Pick<IBlueprint.ISbc, ProjectionCardSbc>]: IBlueprint.ISbc[key]},
}
