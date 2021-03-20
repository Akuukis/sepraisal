
const POWER_BATTERY = [
    'BatteryBlock/LargeBlockBatteryBlock',
    'BatteryBlock/SmallBlockBatteryBlock',
    'BatteryBlock/SmallBlockSmallBatteryBlock',
]
const POWER_ENGINE = [
    'HydrogenEngine/LargeHydrogenEngine',
    'HydrogenEngine/SmallHydrogenEngine',
    'Reactor/LargeBlockLargeGenerator',
    'Reactor/LargeBlockSmallGenerator',
    'Reactor/SmallBlockLargeGenerator',
    'Reactor/SmallBlockSmallGenerator',
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
]
const COCKPIT_OPEN = [
    'Cockpit/CockpitOpen',
    'Cockpit/LargeBlockCockpitSeat',
    'Cockpit/OpenCockpitSmall',
]
const COCKPIT = ([] as string[])
    .concat(COCKPIT_CLOSED)
    .concat(COCKPIT_OPEN)

const WHEELS = [
    'MotorSuspension/Suspension3x3"',
    'MotorSuspension/Suspension5x5"',
    'MotorSuspension/Suspension1x1"',
    'MotorSuspension/SmallSuspension3x3"',
    'MotorSuspension/SmallSuspension5x5"',
    'MotorSuspension/SmallSuspension1x1"',
    'MotorSuspension/Suspension3x3mirrored"',
    'MotorSuspension/Suspension5x5mirrored"',
    'MotorSuspension/Suspension1x1mirrored"',
    'MotorSuspension/SmallSuspension3x3mirrored"',
    'MotorSuspension/SmallSuspension5x5mirrored"',
    'MotorSuspension/SmallSuspension1x1mirrored"',
]

const THRUSTER_ATMOSPHERIC = [
    'Thrust/LargeBlockLargeAtmosphericThrust',
    'Thrust/LargeBlockSmallAtmosphericThrust',
    'Thrust/SmallBlockLargeAtmosphericThrust',
    'Thrust/SmallBlockSmallAtmosphericThrust',
]
const THRUSTER_ION = [
    'Thrust/LargeBlockLargeThrust',
    'Thrust/LargeBlockSmallThrust',
    'Thrust/SmallBlockLargeThrust',
    'Thrust/SmallBlockSmallThrust',
]
const THRUSTER_HYDROGEN = [
    'Thrust/LargeBlockLargeHydrogenThrust',
    'Thrust/LargeBlockSmallHydrogenThrust',
    'Thrust/SmallBlockLargeHydrogenThrust',
    'Thrust/SmallBlockSmallHydrogenThrust',
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
]
const WEAPON_FIXED = [
    'SmallMissileLauncher/',
    'SmallMissileLauncher/LargeMissileLauncher',
    'SmallMissileLauncherReload/SmallRocketLauncherReload',
    'SmallGatlingGun/',
]
const WEAPON = ([] as string[])
    .concat(WEAPON_TURRET)
    .concat(WEAPON_FIXED)

const GYRO = [
    'Gyro/LargeBlockGyro',
    'Gyro/SmallBlockGyro',
]

const RESPAWN = [
    'MedicalRoom/LargeMedicalRoom',
    'SurvivalKit/SurvivalKitLarge',
    'SurvivalKit/SurvivalKit',
]

const RENEWABLES = [
    'SolarPanel/LargeBlockSolarPanel',
    'SolarPanel/SmallBlockSolarPanel',
    'WindTurbine/LargeBlockWindTurbine',
]

const TOOL_DRILL = [
    'Drill/SmallBlockDrill',
    'Drill/LargeBlockDrill',
]
const TOOL_WELDER = [
    "ShipWelder/LargeShipWelder",
    "ShipWelder/SmallShipWelder",
]
const TOOL_GRINDER = [
    "ShipGrinder/LargeShipGrinder",
    "ShipGrinder/SmallShipGrinder",
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
