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

    const remotes = countBlocks(sbc.blocks, [
        'RemoteControl/LargeBlockRemoteControl',
        'RemoteControl/SmallBlockRemoteControl',
    ])

    const cameras = countBlocks(sbc.blocks, [
        'CameraBlock/SmallCameraBlock',
        'CameraBlock/LargeCameraBlock',
        'CameraBlock/LargeCameraTopMounted',
        'CameraBlock/SmallCameraTopMounted',
    ])

    const oreDetectors = countBlocks(sbc.blocks, [
        'OreDetector/LargeOreDetector',
        'OreDetector/SmallBlockOreDetector',
        'OreDetector/LargeOreDetectorReskin',
        'OreDetector/SmallOreDetectorReskin',
    ])

    const landingGears = countBlocks(sbc.blocks, [
        'LandingGear/LargeBlockLandingGear',
        'LandingGear/SmallBlockLandingGear',
        'LandingGear/LargeBlockSmallMagneticPlate',
        'LandingGear/SmallBlockSmallMagneticPlate',
        'LandingGear/LargeBlockLandingGearReskin',
        'LandingGear/SmallBlockLandingGearReskin',
        'LandingGear/LargeBlockMagneticPlate',
        'LandingGear/SmallBlockMagneticPlate',
    ])

    const beacons = countBlocks(sbc.blocks, [
        'Beacon/LargeBlockBeacon',
        'Beacon/SmallBlockBeacon',
        'Beacon/LargeBlockBeaconReskin',
        'Beacon/SmallBlockBeaconReskin',
    ])

    const radioAntennas = countBlocks(sbc.blocks, [
        'RadioAntenna/LargeBlockRadioAntenna',
        'RadioAntenna/LargeBlockCompactRadioAntenna',
        'RadioAntenna/SmallBlockRadioAntenna',
        'RadioAntenna/LargeBlockCompactRadioAntennaReskin',
        'RadioAntenna/SmallBlockCompactRadioAntennaReskin',
    ])

    const laserAntenna = countBlocks(sbc.blocks, [
        'LaserAntenna/LargeBlockLaserAntenna',
        'LaserAntenna/SmallBlockLaserAntenna',
    ])

    const spotlights = countBlocks(sbc.blocks, [
        'ReflectorLight/LargeBlockFrontLight',
        'ReflectorLight/SmallBlockFrontLight',
        'ReflectorLight/RotatingLightLarge',
        'ReflectorLight/RotatingLightSmall',
        'ReflectorLight/OffsetSpotlight',
        'ReflectorLight/LargeBlockFloodlight',
        'ReflectorLight/LargeBlockFloodlightAngled',
        'ReflectorLight/LargeBlockFloodlightCornerL',
        'ReflectorLight/LargeBlockFloodlightCornerR',
        'ReflectorLight/SmallBlockFloodlight',
        'ReflectorLight/SmallBlockFloodlightAngled',
        'ReflectorLight/SmallBlockFloodlightCornerL',
        'ReflectorLight/SmallBlockFloodlightCornerR',
        'ReflectorLight/SmallBlockFloodlightDown',
        'ReflectorLight/SmallBlockFloodlightAngledRotated',
    ])

    const medical = countBlocks(sbc.blocks, [
        'MedicalRoom/LargeMedicalRoom',
        'MedicalRoom/LargeMedicalRoomReskin',
    ])

    const cryoChambers = countBlocks(sbc.blocks, [
        'CryoChamber/LargeBlockCryoChamber',
        'CryoChamber/SmallBlockCryoChamber',
        'CryoChamber/LargeBlockCryoRoom',
        'CryoChamber/LargeBlockCryoLabVat',
    ])

    const beds = countBlocks(sbc.blocks, [
        'CryoChamber/LargeBlockBed',
        'CryoChamber/LargeBlockBedFree',
        'CryoChamber/SmallBlockBunkBed',
        'CryoChamber/LargeBlockInsetBed',
        'CryoChamber/LargeBlockHalfBed',
        'CryoChamber/LargeBlockHalfBedOffset',
    ])


    const survivalKits = countBlocks(sbc.blocks, [
        'SurvivalKit/SurvivalKitLarge',
        'SurvivalKit/SurvivalKit',
        'SurvivalKit/SurvivalKitLargeReskin',
        'SurvivalKit/SurvivalKitSmallReskin',
    ])

    const airVents = countBlocks(sbc.blocks, [
        'AirVent/',
        'AirVent/AirVentFull',
        'AirVent/SmallAirVent',
        'AirVent/SmallAirVentFull',
        'AirVent/AirVentFan',
        'AirVent/AirVentFanFull',
        'AirVent/SmallAirVentFan',
        'AirVent/SmallAirVentFanFull',
    ])

    const oxygenTanks = countBlocks(sbc.blocks, [
        'OxygenTank/',
        'OxygenTank/OxygenTankSmall',
        'OxygenTank/SmallOxygenTankSmall',
        'OxygenTank/LargeBlockOxygenTankLab',
    ])

    const oxygenFarm = countBlocks(sbc.blocks, [
        'OxygenFarm/LargeBlockOxygenFarm',
        'OxygenFarm/LargeBlockOxygenFarmReskin',
    ])

    const oxygenGenerator = countBlocks(sbc.blocks, [
        'OxygenGenerator/',
        'OxygenGenerator/OxygenGeneratorSmall',
        'OxygenGenerator/LargeBlockPrototechOxygenGenerator',
    ])

    const hydrogenTanks = countBlocks(sbc.blocks, [
        'OxygenTank/LargeHydrogenTank',
        'OxygenTank/LargeHydrogenTankIndustrial',
        'OxygenTank/LargeHydrogenTankBulk',
        'OxygenTank/LargeHydrogenTankSmall',
        'OxygenTank/LargeHydrogenTankSmallLab',
        'OxygenTank/SmallHydrogenTank',
        'OxygenTank/SmallHydrogenTankBulk',
        'OxygenTank/SmallHydrogenTankSmall',
        'OxygenTank/SmallHydrogenTankLab',
    ])

    const connectors = countBlocks(sbc.blocks, [
        'ShipConnector/Connector',
        'ShipConnector/ConnectorMedium',
        'ShipConnector/ConnectorSmall',
        'ShipConnector/SmallBlockInsetConnector',
        'ShipConnector/SmallBlockInsetConnectorMedium',
        'ShipConnector/LargeBlockInsetConnector',
        'ShipConnector/LargeBlockInsetConnectorSmall',
        'ShipConnector/LargeBlockStructural_PlatformConnector',
    ])

    const virtualMass = countBlocks(sbc.blocks, [
        'VirtualMass/VirtualMassLarge',
        'VirtualMass/VirtualMassSmall',
    ])

    const gravityGen = countBlocks(sbc.blocks, [
        'GravityGenerator/',
        'GravityGeneratorSphere/',
    ])

    const mergeBlocks = countBlocks(sbc.blocks, [
        'MergeBlock/LargeShipMergeBlock',
        'MergeBlock/SmallShipMergeBlock',
        'MergeBlock/SmallShipSmallMergeBlock',
    ])

    const lights = countBlocks(sbc.blocks, [
        'InteriorLight/OffsetLight',
        'InteriorLight/AirDuctLight',
        'InteriorLight/SmallLight',
        'InteriorLight/SmallBlockSmallLight',
        'InteriorLight/LargeBlockLight_1corner',
        'InteriorLight/LargeBlockLight_2corner',
        'InteriorLight/SmallBlockLight_1corner',
        'InteriorLight/SmallBlockLight_2corner',
        'InteriorLight/PassageSciFiLight',
        'InteriorLight/LargeLightPanel',
        'InteriorLight/SmallLightPanel',
        'InteriorLight/LargeBlockInsetTerrariumDesert',
        'InteriorLight/LargeBlockInsetTerrariumForest',
        'InteriorLight/LargeInsetPlanter',
        'InteriorLight/LargeBlockConduitLight',
        'InteriorLight/LargeBlockConduitLightInv',
        'InteriorLight/LargeBlockTrofferLight',
        'InteriorLight/LargeBlockHalfTrofferLight',
        'InteriorLight/LargeBlockHalfTrofferLightInv',
        'InteriorLight/LargeBlockInsetAquarium',
        'InteriorLight/LargeBlockInsetKitchen',
        'InteriorLight/CorridorRoundLight',
        'InteriorLight/LabEquipment2',
        'InteriorLight/LargeBlockInsetLight',
        'InteriorLight/SmallBlockInsetLight',
        'InteriorLight/LargeBlockLightRound',
        'InteriorLight/SmallBlockLightRound',
        'InteriorLight/LargeBlockLightSquare',
        'InteriorLight/SmallBlockLightSquare',
        'InteriorLight/LargeBlockInsetWallLight',
        'InteriorLight/CorridorLight',
        'InteriorLight/CorridorNarrowStowage',
        'InteriorLight/TrussPillarLight',
        'InteriorLight/TrussPillarLightSmall',
    ])

    const cockpits = countBlocks(sbc.blocks, [
        'Cockpit/LargeBlockCockpitIndustrial',
        'Cockpit/SmallBlockCockpitIndustrial',
        'Cockpit/DBSmallBlockFighterCockpit',
        'Cockpit/SmallBlockCockpit',
        'Cockpit/RoverCockpit',
        'Cockpit/BuggyCockpit',
        'Cockpit/SpeederCockpit',
        'Cockpit/SpeederCockpitCompact',
        'Cockpit/LargeBlockClosedSlopedCockpit',
        'Cockpit/SmallBlockClosedSlopedCockpit',
        'Cockpit/CockpitOpen',
        'Cockpit/LargeBlockCockpitSeat',
        'Cockpit/OpenCockpitSmall',
        'Cockpit/SmallBlockCapCockpit',
        'Cockpit/OpenCockpitLarge',
        'Cockpit/LargeBlockModularBridgeCockpit',
        'Cockpit/SmallBlockFlushCockpit',
        'Cockpit/SmallBlockStandingCockpit',
        'Cockpit/LargeBlockStandingCockpit',
        'Cockpit/LargeBlockSuspendedControlSeat',
        'Cockpit/LargeBlockSuspendedControlSeatB',
        'Cockpit/SmallBlockSuspendedControlSeat',
        'Cockpit/SmallBlockSuspendedControlSeatB',
        'Cockpit/LargeBlockOpenSlopedCockpit',
        'Cockpit/SmallBlockOpenSlopedCockpit',
    ])

    const irrigationSystems = countBlocks(sbc.blocks, [
        'OxygenGenerator/IrrigationSystem',
    ])

    const algaeFarms = countBlocks(sbc.blocks, [
        'FunctionalBlock/LargeBlockAlgaeFarm',
        'FunctionalBlock/LargeBlockAlgaeFarmReskin',
    ])

    const farmPlots = countBlocks(sbc.blocks, [
        'FunctionalBlock/LargeBlockFarmPlot',
    ])

    const refineries = countBlocks(sbc.blocks, [
        'Refinery/LargeRefinery',
        'Refinery/Blast Furnace',
        'Refinery/LargeRefineryIndustrial',
        'Refinery/LargePrototechRefinery',
        'Refinery/SmallPrototechRefinery',
    ])

    const assemblers = countBlocks(sbc.blocks, [
        'Assembler/LargeAssembler',
        'Assembler/BasicAssembler',
        'Assembler/LargePrototechAssembler',
        'Assembler/LargeAssemblerIndustrial',
        'Assembler/FoodProcessor',
    ])

    const tools = countBlocks(sbc.blocks, [
        'Drill/LargeBlockDrill',
        'Drill/SmallBlockDrill',
        'Drill/LargeBlockDrillReskin',
        'Drill/SmallBlockDrillReskin',
        'Drill/LargeBlockPrototechDrill',
        'ShipGrinder/LargeShipGrinder',
        'ShipGrinder/SmallShipGrinder',
        'ShipGrinder/LargeShipGrinderReskin',
        'ShipGrinder/SmallShipGrinderReskin',
        'ShipWelder/LargeShipWelder',
        'ShipWelder/SmallShipWelder',
        'ShipWelder/LargeShipWelderReskin',
        'ShipWelder/SmallShipWelderReskin',
    ])

    const total = 0
      + remotes
      + cameras
      + oreDetectors
      + landingGears
      + beacons
      + radioAntennas
      + laserAntenna
      + spotlights
      + medical
      + cryoChambers
      + beds
      + survivalKits
      + airVents
      // + oxygenTanks
      + oxygenFarm
      + oxygenGenerator
      // + hydrogenTanks
      + connectors
      + virtualMass
      + gravityGen
      + mergeBlocks
      + lights
      + cockpits
      + irrigationSystems
      + algaeFarms
      + farmPlots
      + refineries
      + assemblers
      + tools

    return (
        <MySection heading='Utilities' label='total' value={total} className={clsx(classes.root, className)} {...otherProps}>
            <MyBoxColumn height={1} width={3}>
                <MyBoxRow height={1} width={3}>
                    <MyBox width={2}>
                        <ValueCell label='cockpits' value={cockpits || '-'} />
                        <ValueCell label='remotes' value={remotes || '-'} />
                    </MyBox>
                    <MyBox width={1}>
                        <ValueCell label='cameras' value={cameras || '-'} />
                    </MyBox>
                </MyBoxRow>
            </MyBoxColumn>
            <MyBoxColumn height={4} width={6}>
                <MyBoxRow height={4} width={6}>
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
                        <ValueCell label='beds' value={beds || '-'} />
                    </MyBox>
                    <MyBox width={2}>
                        <ValueCell label='spotlights' value={spotlights || '-'} />
                        <ValueCell label='lights' value={lights || '-'} />
                    </MyBox>
                    <MyBox width={3}>
                        <ValueCell label='air vents' value={airVents || '-'} />
                        <ValueCell label='oxygen farm' value={oxygenFarm || '-'} />
                        <ValueCell label='oxygen generator' value={oxygenGenerator || '-'} />
                    </MyBox>
                    <MyBox width={1}>
                        <ValueCell label='ore detectors' value={oreDetectors || '-'} />
                    </MyBox>
                    <MyBox width={2}>
                        <ValueCell label='virtual mass' value={virtualMass || '-'} />
                        <ValueCell label='gravity gen.' value={gravityGen || '-'} />
                    </MyBox>
                    <MyBox width={3}>
                        <ValueCell label='irrigation system' value={irrigationSystems || '-'} />
                        <ValueCell label='farm plots' value={farmPlots || '-'} />
                        <ValueCell label='algae farms' value={algaeFarms || '-'} />
                    </MyBox>
                    <MyBox width={3}>
                        <ValueCell label='refineries' value={refineries || '-'} />
                        <ValueCell label='assemblers' value={assemblers || '-'} />
                        <ValueCell label='tools' value={tools || '-'} />
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
