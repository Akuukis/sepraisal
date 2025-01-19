
const POWER_BATTERY = [
    'BatteryBlock/*',
]
const POWER_ENGINE = [
    'HydrogenEngine/*',
    'Reactor/*',
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
    'Cockpit/SpeederCockpit',
    'Cockpit/SpeederCockpitCompact',
    'Cockpit/SmallBlockStandingCockpit',
    'Cockpit/LargeBlockStandingCockpit',
]
const COCKPIT = ([] as string[])
    .concat(COCKPIT_CLOSED)
    .concat(COCKPIT_OPEN)

const WHEELS = [
    'MotorSuspension/*',
]

const THRUSTER_ATMOSPHERIC = [
    'Thrust/LargeBlockLargeAtmosphericThrust',
    'Thrust/LargeBlockSmallAtmosphericThrust',
    'Thrust/SmallBlockLargeAtmosphericThrust',
    'Thrust/SmallBlockSmallAtmosphericThrust',
    'Thrust/LargeBlockLargeAtmosphericThrustSciFi',
    'Thrust/LargeBlockSmallAtmosphericThrustSciFi',
    'Thrust/SmallBlockLargeAtmosphericThrustSciFi',
    'Thrust/SmallBlockSmallAtmosphericThrustSciFi',
    'Thrust/LargeBlockLargeFlatAtmosphericThrust',
    'Thrust/LargeBlockLargeFlatAtmosphericThrustDShape',
    'Thrust/LargeBlockSmallFlatAtmosphericThrust',
    'Thrust/LargeBlockSmallFlatAtmosphericThrustDShape',
    'Thrust/SmallBlockLargeFlatAtmosphericThrust',
    'Thrust/SmallBlockLargeFlatAtmosphericThrustDShape',
    'Thrust/SmallBlockSmallFlatAtmosphericThrust',
    'Thrust/SmallBlockSmallFlatAtmosphericThrustDShape',
]
const THRUSTER_ION = [
    'Thrust/LargeBlockLargeThrust',
    'Thrust/LargeBlockSmallThrust',
    'Thrust/SmallBlockLargeThrust',
    'Thrust/SmallBlockSmallThrust',
    'Thrust/SmallBlockSmallThrustSciFi',
    'Thrust/SmallBlockLargeThrustSciFi',
    'Thrust/LargeBlockSmallThrustSciFi',
    'Thrust/LargeBlockLargeThrustSciFi',
    'Thrust/LargeBlockPrototechThruster',
    'Thrust/SmallBlockPrototechThruster',
    'Thrust/SmallBlockSmallModularThruster',
    'Thrust/SmallBlockLargeModularThruster',
    'Thrust/LargeBlockSmallModularThruster',
    'Thrust/LargeBlockLargeModularThruster',
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
]
const THRUSTER = ([] as string[])
    .concat(THRUSTER_ATMOSPHERIC)
    .concat(THRUSTER_ION)
    .concat(THRUSTER_HYDROGEN)

const WEAPON_TURRET = [
    'LargeGatlingTurret/',
    'LargeGatlingTurret/*',
    'LargeMissileTurret/',
    'LargeMissileTurret/*',
    'InteriorTurret/LargeInteriorTurret',
    'TurretControlBlock/LargeTurretControlBlock',
    'TurretControlBlock/SmallTurretControlBlock',
]
const WEAPON_FIXED = [
    'SmallMissileLauncher/',
    'SmallMissileLauncher/*',
    'SmallMissileLauncherReload/*',
    'SmallGatlingGun/',
    'SmallGatlingGun/*',
]
const WEAPON = ([] as string[])
    .concat(WEAPON_TURRET)
    .concat(WEAPON_FIXED)

const GYRO = [
    'Gyro/*',
]

const RESPAWN = [
    'MedicalRoom/*',
    'SurvivalKit/*',
]

const RENEWABLES = [
    'SolarPanel/*',
    'WindTurbine/*',
]

const TOOL_DRILL = [
    'Drill/*',
]
const TOOL_WELDER = [
    'ShipWelder/*',
]
const TOOL_GRINDER = [
    'ShipGrinder/*',
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
