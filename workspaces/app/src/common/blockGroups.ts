
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
]
const COCKPIT_OPEN = [
    'Cockpit/CockpitOpen',
    'Cockpit/LargeBlockCockpitSeat',
    'Cockpit/OpenCockpitSmall',
]
const COCKPIT = ([] as string[])
    .concat(COCKPIT_CLOSED)
    .concat(COCKPIT_OPEN)

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

export const BLOCK_GROUPS = {
    POWER,
    POWER_BATTERY,
    POWER_ENGINE,
    COCKPIT,
    COCKPIT_CLOSED,
    COCKPIT_OPEN,
    THRUSTER,
    THRUSTER_ATMOSPHERIC,
    THRUSTER_HYDROGEN,
    THRUSTER_ION,
    WEAPON,
    WEAPON_FIXED,
    WEAPON_TURRET,
    RESPAWN,
    RENEWABLES,
}
