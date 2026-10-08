
const POWER_BATTERY = [
    'BatteryBlock/LargeBlockBatteryBlock',
    'BatteryBlock/SmallBlockBatteryBlock',
    'BatteryBlock/SmallBlockSmallBatteryBlock',
    'BatteryBlock/LargeBlockBatteryBlockWarfare2',
    'BatteryBlock/SmallBlockBatteryBlockWarfare2',
    'BatteryBlock/LargeBlockBatteryReskin',
    'BatteryBlock/LargeBlockBatteryReskinOffset',
    'BatteryBlock/SmallBlockBatteryReskin',
    'BatteryBlock/LargeBlockPrototechBattery',
    'BatteryBlock/SmallBlockPrototechBattery',
]
const POWER_ENGINE = [
    'HydrogenEngine/LargeHydrogenEngine',
    'HydrogenEngine/SmallHydrogenEngine',
    'HydrogenEngine/LargeHydrogenEngineReskin',
    'HydrogenEngine/SmallHydrogenEngineReskin',
    'HydrogenEngine/LargePrototechReactor',
    'Reactor/LargeBlockLargeGenerator',
    'Reactor/LargeBlockSmallGenerator',
    'Reactor/SmallBlockLargeGenerator',
    'Reactor/SmallBlockSmallGenerator',
    'Reactor/LargeBlockSmallGeneratorWarfare2',
    'Reactor/LargeBlockLargeGeneratorWarfare2',
    'Reactor/SmallBlockSmallGeneratorWarfare2',
    'Reactor/SmallBlockLargeGeneratorWarfare2',
]
const POWER = ([] as string[])
    .concat(POWER_BATTERY)
    .concat(POWER_ENGINE)

const COCKPIT_CLOSED = [
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
]
const COCKPIT_OPEN = [
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
]
const COCKPIT = ([] as string[])
    .concat(COCKPIT_CLOSED)
    .concat(COCKPIT_OPEN)

const WHEELS = [
    'MotorSuspension/Suspension3x3',
    'MotorSuspension/Suspension5x5',
    'MotorSuspension/Suspension1x1',
    'MotorSuspension/Suspension2x2',
    'MotorSuspension/SmallSuspension3x3',
    'MotorSuspension/SmallSuspension5x5',
    'MotorSuspension/SmallSuspension1x1',
    'MotorSuspension/SmallSuspension2x2',
    'MotorSuspension/Suspension3x3mirrored',
    'MotorSuspension/Suspension5x5mirrored',
    'MotorSuspension/Suspension1x1mirrored',
    'MotorSuspension/Suspension2x2Mirrored',
    'MotorSuspension/SmallSuspension3x3mirrored',
    'MotorSuspension/SmallSuspension5x5mirrored',
    'MotorSuspension/SmallSuspension1x1mirrored',
    'MotorSuspension/SmallSuspension2x2Mirrored',
    'MotorSuspension/ShortSuspension3x3',
    'MotorSuspension/ShortSuspension5x5',
    'MotorSuspension/ShortSuspension1x1',
    'MotorSuspension/ShortSuspension2x2',
    'MotorSuspension/SmallShortSuspension3x3',
    'MotorSuspension/SmallShortSuspension5x5',
    'MotorSuspension/SmallShortSuspension1x1',
    'MotorSuspension/SmallShortSuspension2x2',
    'MotorSuspension/ShortSuspension3x3mirrored',
    'MotorSuspension/ShortSuspension5x5mirrored',
    'MotorSuspension/ShortSuspension1x1mirrored',
    'MotorSuspension/ShortSuspension2x2Mirrored',
    'MotorSuspension/SmallShortSuspension3x3mirrored',
    'MotorSuspension/SmallShortSuspension5x5mirrored',
    'MotorSuspension/SmallShortSuspension1x1mirrored',
    'MotorSuspension/SmallShortSuspension2x2Mirrored',
    'MotorSuspension/OffroadSuspension3x3',
    'MotorSuspension/OffroadSuspension5x5',
    'MotorSuspension/OffroadSuspension1x1',
    'MotorSuspension/OffroadSuspension2x2',
    'MotorSuspension/OffroadSmallSuspension3x3',
    'MotorSuspension/OffroadSmallSuspension5x5',
    'MotorSuspension/OffroadSmallSuspension1x1',
    'MotorSuspension/OffroadSmallSuspension2x2',
    'MotorSuspension/OffroadSuspension3x3mirrored',
    'MotorSuspension/OffroadSuspension5x5mirrored',
    'MotorSuspension/OffroadSuspension1x1mirrored',
    'MotorSuspension/OffroadSuspension2x2Mirrored',
    'MotorSuspension/OffroadSmallSuspension3x3mirrored',
    'MotorSuspension/OffroadSmallSuspension5x5mirrored',
    'MotorSuspension/OffroadSmallSuspension1x1mirrored',
    'MotorSuspension/OffroadSmallSuspension2x2Mirrored',
    'MotorSuspension/OffroadShortSuspension3x3',
    'MotorSuspension/OffroadShortSuspension5x5',
    'MotorSuspension/OffroadShortSuspension1x1',
    'MotorSuspension/OffroadShortSuspension2x2',
    'MotorSuspension/OffroadSmallShortSuspension3x3',
    'MotorSuspension/OffroadSmallShortSuspension5x5',
    'MotorSuspension/OffroadSmallShortSuspension1x1',
    'MotorSuspension/OffroadSmallShortSuspension2x2',
    'MotorSuspension/OffroadShortSuspension3x3mirrored',
    'MotorSuspension/OffroadShortSuspension5x5mirrored',
    'MotorSuspension/OffroadShortSuspension1x1mirrored',
    'MotorSuspension/OffroadShortSuspension2x2Mirrored',
    'MotorSuspension/OffroadSmallShortSuspension3x3mirrored',
    'MotorSuspension/OffroadSmallShortSuspension5x5mirrored',
    'MotorSuspension/OffroadSmallShortSuspension1x1mirrored',
    'MotorSuspension/OffroadSmallShortSuspension2x2Mirrored',
]

const THRUSTER_ATMOSPHERIC = [
    'Thrust/LargeBlockLargeAtmosphericThrust',
    'Thrust/LargeBlockSmallAtmosphericThrust',
    'Thrust/SmallBlockLargeAtmosphericThrust',
    'Thrust/SmallBlockSmallAtmosphericThrust',
    'Thrust/LargeBlockLargeFlatAtmosphericThrust',
    'Thrust/LargeBlockLargeFlatAtmosphericThrustDShape',
    'Thrust/LargeBlockSmallFlatAtmosphericThrust',
    'Thrust/LargeBlockSmallFlatAtmosphericThrustDShape',
    'Thrust/SmallBlockLargeFlatAtmosphericThrust',
    'Thrust/SmallBlockLargeFlatAtmosphericThrustDShape',
    'Thrust/SmallBlockSmallFlatAtmosphericThrust',
    'Thrust/SmallBlockSmallFlatAtmosphericThrustDShape',
    'Thrust/LargeBlockLargeAtmosphericThrustSciFi',
    'Thrust/LargeBlockSmallAtmosphericThrustSciFi',
    'Thrust/SmallBlockLargeAtmosphericThrustSciFi',
    'Thrust/SmallBlockSmallAtmosphericThrustSciFi',
]
const THRUSTER_ION = [
    'Thrust/LargeBlockLargeThrust',
    'Thrust/LargeBlockSmallThrust',
    'Thrust/SmallBlockLargeThrust',
    'Thrust/SmallBlockSmallThrust',
    'Thrust/SmallBlockSmallModularThruster',
    'Thrust/SmallBlockLargeModularThruster',
    'Thrust/LargeBlockSmallModularThruster',
    'Thrust/LargeBlockLargeModularThruster',
    'Thrust/SmallBlockSmallThrustSciFi',
    'Thrust/SmallBlockLargeThrustSciFi',
    'Thrust/LargeBlockSmallThrustSciFi',
    'Thrust/LargeBlockLargeThrustSciFi',
    'Thrust/LargeBlockPrototechThruster',
    'Thrust/SmallBlockPrototechThruster',
]
const THRUSTER_HYDROGEN = [
    'Thrust/LargeBlockLargeHydrogenThrust',
    'Thrust/LargeBlockSmallHydrogenThrust',
    'Thrust/SmallBlockLargeHydrogenThrust',
    'Thrust/SmallBlockSmallHydrogenThrust',
    'Thrust/LargeBlockLargeHydrogenThrustIndustrial',
    'Thrust/LargeBlockSmallHydrogenThrustIndustrial',
    'Thrust/SmallBlockLargeHydrogenThrustIndustrial',
    'Thrust/SmallBlockSmallHydrogenThrustIndustrial',
    'Thrust/LargeBlockLargeHydrogenThrustReskin',
    'Thrust/LargeBlockSmallHydrogenThrustReskin',
    'Thrust/SmallBlockLargeHydrogenThrustReskin',
    'Thrust/SmallBlockSmallHydrogenThrustReskin',
]
const THRUSTER = ([] as string[])
    .concat(THRUSTER_ATMOSPHERIC)
    .concat(THRUSTER_ION)
    .concat(THRUSTER_HYDROGEN)

const WEAPON_TURRET = [
    'LargeGatlingTurret/',
    'LargeGatlingTurret/SmallGatlingTurret',
    'LargeMissileTurret/',
    'LargeMissileTurret/SmallMissileTurret',
    'InteriorTurret/LargeInteriorTurret',
    'LargeMissileTurret/LargeCalibreTurret',
    'LargeMissileTurret/LargeBlockMediumCalibreTurret',
    'LargeMissileTurret/SmallBlockMediumCalibreTurret',
    'LargeGatlingTurret/AutoCannonTurret',
    'LargeMissileTurret/LargeMissileTurretReskin',
    'LargeMissileTurret/SmallMissileTurretReskin',
    'LargeGatlingTurret/LargeGatlingTurretReskin',
    'LargeGatlingTurret/SmallGatlingTurretReskin',
]
const WEAPON_FIXED = [
    'SmallMissileLauncher/',
    'SmallMissileLauncher/LargeMissileLauncher',
    'SmallMissileLauncherReload/SmallRocketLauncherReload',
    'SmallGatlingGun/',
    'SmallGatlingGun/SmallBlockAutocannon',
    "SmallGatlingGun/SmallGatlingGunWarfare2",
    'SmallMissileLauncherReload/SmallBlockMediumCalibreGun',
    'SmallMissileLauncherReload/LargeRailgun',
    'SmallMissileLauncherReload/SmallRailgun',
    "SmallMissileLauncher/SmallMissileLauncherWarfare2",
    'SmallMissileLauncher/LargeBlockLargeCalibreGun',
    'SmallMissileLauncher/LargeFlareLauncher',
    'SmallMissileLauncher/SmallFlareLauncher',
    "Warhead/LargeWarhead",
    "Warhead/SmallWarhead",
]
const WEAPON = ([] as string[])
    .concat(WEAPON_TURRET)
    .concat(WEAPON_FIXED)

const GYRO = [
    'Gyro/LargeBlockGyro',
    'Gyro/SmallBlockGyro',
    'Gyro/LargeBlockPrototechGyro',
    'Gyro/SmallBlockPrototechGyro',
]

const RESPAWN = [
    'MedicalRoom/LargeMedicalRoom',
    'MedicalRoom/LargeMedicalRoomReskin',
    'SurvivalKit/SurvivalKitLarge',
    'SurvivalKit/SurvivalKit',
    'SurvivalKit/SurvivalKitLargeReskin',
    'SurvivalKit/SurvivalKitSmallReskin',
]

const RENEWABLES = [
    'SolarPanel/LargeBlockSolarPanel',
    'SolarPanel/SmallBlockSolarPanel',
    'SolarPanel/LargeBlockColorableSolarPanel',
    'SolarPanel/LargeBlockColorableSolarPanelCorner',
    'SolarPanel/LargeBlockColorableSolarPanelCornerInverted',
    'SolarPanel/SmallBlockColorableSolarPanel',
    'SolarPanel/SmallBlockColorableSolarPanelCorner',
    'SolarPanel/SmallBlockColorableSolarPanelCornerInverted',
    'WindTurbine/LargeBlockWindTurbine',
    'WindTurbine/LargeBlockWindTurbineReskin',
]

const TOOL_DRILL = [
    'Drill/SmallBlockDrill',
    'Drill/LargeBlockDrill',
    'Drill/LargeBlockDrillReskin',
    'Drill/SmallBlockDrillReskin',
    'Drill/LargeBlockPrototechDrill',
]
const TOOL_WELDER = [
    'ShipWelder/LargeShipWelder',
    'ShipWelder/SmallShipWelder',
    'ShipWelder/LargeShipWelderReskin',
    'ShipWelder/SmallShipWelderReskin',
]
const TOOL_GRINDER = [
    'ShipGrinder/LargeShipGrinder',
    'ShipGrinder/SmallShipGrinder',
    'ShipGrinder/LargeShipGrinderReskin',
    'ShipGrinder/SmallShipGrinderReskin',
]
const TOOL = ([] as string[])
    .concat(TOOL_DRILL)
    .concat(TOOL_WELDER)
    .concat(TOOL_GRINDER)

export const BLOCK_GROUPS = {
    POWER,
    POWER_BATTERY,
    POWER_ENGINE,
    GYRO,
    COCKPIT,
    COCKPIT_CLOSED,
    COCKPIT_OPEN,
    WHEELS,
    THRUSTER,
    THRUSTER_ATMOSPHERIC,
    THRUSTER_HYDROGEN,
    THRUSTER_ION,
    TOOL,
    TOOL_DRILL,
    TOOL_WELDER,
    TOOL_GRINDER,
    WEAPON,
    WEAPON_FIXED,
    WEAPON_TURRET,
    RESPAWN,
    RENEWABLES,
}
