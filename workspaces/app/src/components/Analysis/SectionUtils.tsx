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
    ])

    const oreDetectors = countBlocks(sbc.blocks, [
        'OreDetector/LargeOreDetector',
        'OreDetector/SmallBlockOreDetector',
    ])

    const landingGears = countBlocks(sbc.blocks, [
        'LandingGear/LargeBlockLandingGear',
        'LandingGear/SmallBlockLandingGear',
    ])

    const beacons = countBlocks(sbc.blocks, [
        'Beacon/LargeBlockBeacon',
        'Beacon/SmallBlockBeacon',
    ])

    const radioAntennas = countBlocks(sbc.blocks, [
        'RadioAntenna/LargeBlockRadioAntenna',
        'RadioAntenna/SmallBlockRadioAntenna',
    ])

    const laserAntenna = countBlocks(sbc.blocks, [
        'LaserAntenna/LargeBlockLaserAntenna',
        'LaserAntenna/SmallBlockLaserAntenna',
    ])

    const spotlights = countBlocks(sbc.blocks, [
        'ReflectorLight/LargeBlockFrontLight',
        'ReflectorLight/SmallBlockFrontLight',
    ])

    const medical = countBlocks(sbc.blocks, [
        'MedicalRoom/LargeMedicalRoom',
    ])

    const cryoChambers = countBlocks(sbc.blocks, [
        'CryoChamber/LargeBlockCryoChamber',
        'CryoChamber/SmallBlockCryoChamber',
    ])

    const survivalKits = countBlocks(sbc.blocks, [
        'SurvivalKit/SurvivalKitLarge',
        'SurvivalKit/SurvivalKit',
    ])

    const airVents = countBlocks(sbc.blocks, [
        'AirVent/',
        'AirVent/SmallAirVent',
    ])

    const oxygenTanks = countBlocks(sbc.blocks, [
        'OxygenTank/OxygenTankSmall',
        'OxygenTank/',
    ])

    const oxygenFarm = countBlocks(sbc.blocks, [
        'OxygenFarm/LargeBlockOxygenFarm',
    ])

    const oxygenGenerator = countBlocks(sbc.blocks, [
        'OxygenGenerator/',
        'OxygenGenerator/OxygenGeneratorSmall',
    ])

    const hydrogenTanks = countBlocks(sbc.blocks, [
        'OxygenTank/LargeHydrogenTank',
        'OxygenTank/SmallHydrogenTank',
    ])

    const connectors = countBlocks(sbc.blocks, [
        'ShipConnector/Connector',
        'ShipConnector/ConnectorMedium',
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
    ])

    const lights = countBlocks(sbc.blocks, [
        'InteriorLight/SmallLight',
        'InteriorLight/SmallBlockSmallLight',
        'InteriorLight/LargeBlockLight_1corner',
        'InteriorLight/LargeBlockLight_2corner',
        'InteriorLight/SmallBlockLight_1corner',
        'InteriorLight/SmallBlockLight_2corner',
    ])

    const cockpits = countBlocks(sbc.blocks, [
        'Cockpit/LargeBlockCockpit',
        'Cockpit/LargeBlockCockpitSeat',
        'Cockpit/SmallBlockCockpit',
        'Cockpit/DBSmallBlockFighterCockpit',
        'Cockpit/CockpitOpen',
        'Cockpit/OpenCockpitSmall',
        'Cockpit/SmallBlockCockpitIndustrial',
        'Cockpit/LargeBlockCockpitIndustrial',
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
            <MyBoxColumn height={3} width={6}>
                <MyBoxRow height={3} width={6}>
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
                        <ValueCell label='ore detectors' value={oreDetectors || '-'} />
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
                    <MyBox width={2}>
                        <ValueCell label='virtual mass' value={virtualMass || '-'} />
                        <ValueCell label='gravity gen.' value={gravityGen || '-'} />
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
