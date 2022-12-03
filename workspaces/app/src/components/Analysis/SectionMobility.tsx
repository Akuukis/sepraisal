import { Direction, GridSize, IBlueprint } from '@sepraisal/common'
import clsx from 'clsx'
import moment from 'moment'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import ValueCell from 'src/components/Cell/ValueCell'

import LegendCell from '../Cell/LegendCell'
import MyBox from '../MyBox'
import MyBoxColumn from '../MyBoxColumn'
import MyBoxRow from '../MyBoxRow'
import MySection from './MySection'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    slider: {
        alignSelf: 'flex-start',
        marginTop: -theme.spacing(1),
        marginButtom: 0,
    }
})


interface IProps extends Omit<React.ComponentProps<typeof MySection>, 'heading' | 'value' | 'label'> {
    bp: IBpProjectionRow
    long?: boolean
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {bp, className, long, ...otherProps} = props
    const {sbc} = bp

    const jumpDrives = sbc.blocks['JumpDrive/LargeJumpDrive'] ?? 0
    const parachutes = (sbc.blocks['Parachute/LgParachute'] ?? 0) + (sbc.blocks['Parachute/SmParachute'] ?? 0)

    const mass = sbc.blockMass

    const reqParachutesForSlow = getRequiredParachutes(5, mass, sbc.gridSize)
    const reqParachutesForMedium = getRequiredParachutes(10, mass, sbc.gridSize)
    const reqParachutesForFast = getRequiredParachutes(15, mass, sbc.gridSize)

    const avgThrustAtmospheric = averageThrust(sbc.thrustAtmospheric)
    const avgThrustHydrogen = averageThrust(sbc.thrustHydrogen)
    const avgThrustIon = averageThrust(sbc.thrustIon)
    const totalThrust = 0
        + avgThrustAtmospheric
        + avgThrustIon
        + (avgThrustHydrogen / 2)
    const totalAccel = speedToFixed(totalThrust, sbc.blockMass, 1)

    // const marks = [
    //     {
    //         value: 0,
    //         label: '0°C',
    //     },
    //     {
    //         value: 20,
    //         label: '20°C',
    //     },
    //     {
    //         value: 37,
    //         label: '37°C',
    //     },
    //     {
    //         value: 100,
    //         label: '100°C',
    //     },
    // ]
    // const valuetext = (value: number) => `${value}°C`

    return (
        <MySection heading='Mobility' label={'avg accel. (m/s\u00B2)'} value={totalAccel} className={clsx(classes.root, className)} {...otherProps}>
            <MyBoxColumn width={3}>
                <MyBoxRow width={3}>
                    <MyBox width={3}>
                        <ValueCell width={3} label={`Wheels`} value={wheeled(sbc.blocks)} />
                        {/* <CenterCell padded>
                            <Slider
                                defaultValue={20}
                                getAriaValueText={valuetext}
                                aria-labelledby="discrete-slider-custom"
                                step={10}
                                valueLabelDisplay="auto"
                                marks={marks}
                            />
                        </CenterCell> */}
                    </MyBox>
                </MyBoxRow>
            </MyBoxColumn>
            <MyBoxColumn height={3} width={3}>
                <MyBoxRow width={3}>
                    <MyBox>
                        <ValueCell label={`gyros`} value={`${gyros(sbc.blockMass, sbc.gridSize, sbc.blocks)}`} />
                    </MyBox>
                    <MyBox width={2}>
                        <ValueCell sm={6} label={`j.drives`} value={jumpDrives || '-'} />
                        <ValueCell sm={6} label={`j.dist (km)`} value={jumpDistance(mass, jumpDrives)} />
                    </MyBox>
                </MyBoxRow>
                <MyBoxRow height={2} width={3}>
                    <MyBox width={3}>
                        <LegendCell legend={`Parachutes`} />
                        <ValueCell label={`amount`} value={parachutes || '-'} />
                        <ValueCell label={`t. velocity (m/s)`} value={terminalVelocity(sbc.blockMass, sbc.blocks)} />
                        <ValueCell label={`req. 15m/s`} value={reqParachutesForFast} />
                        <ValueCell label={`req. 10m/s`} value={reqParachutesForMedium} />
                        <ValueCell label={`req. 5m/s`} value={reqParachutesForSlow} />
                    </MyBox>
                </MyBoxRow>
            </MyBoxColumn>
            <MyBoxColumn height={3} width={3}>
                <MyBoxRow height={3} width={3}>
                    <MyBox width={3}>
                        <LegendCell width={2} legend={`Atmo. acceleration (m/s\u00B2)`} />
                        <ValueCell label={`average`} value={speedToFixed(averageThrust(sbc.thrustAtmospheric), sbc.blockMass, 1)} />
                        <ValueCell label={`upward`} value={speedToFixed(sbc.thrustAtmospheric.Up, sbc.blockMass, 1)} />
                        <ValueCell label={`forward`} value={speedToFixed(sbc.thrustAtmospheric.Forward, sbc.blockMass, 1)} />
                        <ValueCell label={`backward`} value={speedToFixed(sbc.thrustAtmospheric.Backward, sbc.blockMass, 1)} />
                        <ValueCell label={`downward`} value={speedToFixed(sbc.thrustAtmospheric.Down, sbc.blockMass, 1)} />
                        <ValueCell label={`left`} value={speedToFixed(sbc.thrustAtmospheric.Left, sbc.blockMass, 1)} />
                        <ValueCell label={`right`} value={speedToFixed(sbc.thrustAtmospheric.Right, sbc.blockMass, 1)} />
                    </MyBox>
                </MyBoxRow>
            </MyBoxColumn>
            <MyBoxColumn height={3} width={3}>
                <MyBoxRow height={3} width={3}>
                    <MyBox width={3}>
                        <LegendCell width={2} legend={`Hydro. acceleration (m/s\u00B2)`} />
                        <ValueCell label={`average`} value={speedToFixed(averageThrust(sbc.thrustHydrogen), sbc.blockMass, 1)} />
                        <ValueCell label={`upward`} value={speedToFixed(sbc.thrustHydrogen.Up, sbc.blockMass, 1)} />
                        <ValueCell label={`forward`} value={speedToFixed(sbc.thrustHydrogen.Forward, sbc.blockMass, 1)} />
                        <ValueCell label={`backward`} value={speedToFixed(sbc.thrustHydrogen.Backward, sbc.blockMass, 1)} />
                        <ValueCell label={`downward`} value={speedToFixed(sbc.thrustHydrogen.Down, sbc.blockMass, 1)} />
                        <ValueCell label={`left`} value={speedToFixed(sbc.thrustHydrogen.Left, sbc.blockMass, 1)} />
                        <ValueCell label={`right`} value={speedToFixed(sbc.thrustHydrogen.Right, sbc.blockMass, 1)} />
                    </MyBox>
                </MyBoxRow>
            </MyBoxColumn>
            <MyBoxColumn height={3} width={3}>
                <MyBoxRow height={3} width={3}>
                    <MyBox width={3}>
                        <LegendCell width={2} legend={`Ion acceleration (m/s\u00B2)`} />
                        <ValueCell label={`average`} value={speedToFixed(averageThrust(sbc.thrustIon), sbc.blockMass, 1)} />
                        <ValueCell label={`upward`} value={speedToFixed(sbc.thrustIon.Up, sbc.blockMass, 1)} />
                        <ValueCell label={`forward`} value={speedToFixed(sbc.thrustIon.Forward, sbc.blockMass, 1)} />
                        <ValueCell label={`backward`} value={speedToFixed(sbc.thrustIon.Backward, sbc.blockMass, 1)} />
                        <ValueCell label={`downward`} value={speedToFixed(sbc.thrustIon.Down, sbc.blockMass, 1)} />
                        <ValueCell label={`left`} value={speedToFixed(sbc.thrustIon.Left, sbc.blockMass, 1)} />
                        <ValueCell label={`right`} value={speedToFixed(sbc.thrustIon.Right, sbc.blockMass, 1)} />
                    </MyBox>
                </MyBoxRow>
            </MyBoxColumn>
        </MySection>
    )
})) /* ============================================================================================================= */


type ProjectionCardSbc =
    | 'blocks'
    | 'blockMass'
    | 'gridStatic'
    | 'gridSize'
    | 'thrustAtmospheric'
    | 'thrustHydrogen'
    | 'thrustIon'

interface IBpProjectionRow {
    sbc: {[key in keyof Pick<IBlueprint.ISbc, ProjectionCardSbc>]: IBlueprint.ISbc[key]},
}


const averageThrust = (directions: Partial<Record<Direction, number>>) => {
    let total = 0
    for(const direction of (Object.values(Direction) as Direction[])) {
        const thrust = directions[direction]
        total += thrust !== undefined ? thrust : 0
    }

    return total / 6
}

const speedToFixed = (speed: number | undefined, mass: number, toFixed = 2) => {
    if(speed === undefined || speed === 0) return '-'

    return `${(speed / mass).toFixed(toFixed)}`
}

const gyros = (mass: number, gridSize: GridSize, blocks: Partial<Record<string, number>>, toFixed = 2) => {
    const result = blocks[gridSize === 'Small' ? 'Gyro/SmallBlockGyro' : 'Gyro/LargeBlockGyro']
    if(result === undefined) return '-'

    // TODO: Calculate °/s .
    // const forceMagnitude = gridSize === 'Small' ? 3.36 * 10000000 : 448000  // = Torque
    // const force = gyros * forceMagnitude

    return result
}

const terminalVelocity = (mass: number, blocks: {'Parachute/LgParachute'?: number, 'Parachute/SmParachute'?: number}, toFixed = 1) => {
    const largeHatches = blocks['Parachute/LgParachute'] ?? 0
    const smallHatches = blocks['Parachute/SmParachute'] ?? 0
    if(largeHatches === 0 && smallHatches === 0) return '-'

    const RADMULT = 8  // radius multiplier
    const REEFLEVEL = 0.6  // reefing level
    const CD = 1  // drag coefficient


    const GRAVITY = 9.81 // (we'll say this is an Earth-like planet)
    const ATM = 0.85 // (avoid using 1.0 - 0.85 gives a more conservative result)

    const diameterLarge = (Math.log(((ATM - REEFLEVEL) * 10) - 0.99) + 5) * RADMULT * 2.5
    // = (log((10*(0.85-0.6))-0.99)+5)*8*2.5
    // = 103.6

    const areaLarge = Math.PI * Math.pow(diameterLarge / 2, 2) * largeHatches
    // = 8,429.6 *10
    // = 84,296

    const diameterSmall = (Math.log(((ATM - REEFLEVEL) * 10) - 0.99) + 5) * RADMULT * 0.5
    const areaSmall = Math.PI * Math.pow(diameterSmall / 2, 2) * smallHatches

    const area = areaLarge + areaSmall


    const result = Math.sqrt((mass * GRAVITY) / (area * CD * ATM * 1.225 * 2.5))
    // = squareroot((2927310*9.81)/(84296*1.0*0.85*1.225*2.5))
    // = 11.4 m/s

    return result.toFixed(toFixed)
}

const wheeled = (blocks: Record<string, number>) => {
    const entries = Object.entries(blocks)
    const x1 = entries.filter(([cube]) => cube.includes('Suspension1x1')).reduce((sum, [, count]) => sum + count, 0)
    const x3 = entries.filter(([cube]) => cube.includes('Suspension3x3')).reduce((sum, [, count]) => sum + count, 0)
    const x5 = entries.filter(([cube]) => cube.includes('Suspension5x5')).reduce((sum, [, count]) => sum + count, 0)

    if(x1 + x3 + x5 === 0) return '-'

    return [
        x1 === 0 ? undefined : `${x1} small`,
        x3 === 0 ? undefined : `${x3} medium`,
        x5 === 0 ? undefined : `${x5} large`,
    ]
        .filter((val) => val !== undefined)
        .join(', ')
}

const getRequiredParachutes = (targetVelocity: number, mass: number, gridSize: GridSize) => {
    const parachuteGridSize = gridSize === GridSize.Small
    let amount = 0
    let currentVelocity = Number.POSITIVE_INFINITY
    do {
        amount = amount + 1
        currentVelocity = Number(terminalVelocity(mass, {[parachuteGridSize ? 'Parachute/SmParachute' : 'Parachute/LgParachute' ]: amount}))

    } while (currentVelocity > targetVelocity)

    return amount
}

const hydroFuel = (gridSize: GridSize, blocks: Partial<Record<string, number>>, thrust: Partial<Record<Direction, number>>) => {
    const tanks = blocks[gridSize === 'Small' ? 'OxygenTank/SmallHydrogenTank' : 'OxygenTank/LargeHydrogenTank']
    if(tanks === undefined) return '-'

    const capacity = gridSize === 'Small' ? 80000 : 2500000
    const total = tanks * capacity
    if(total === 0) return '-'

    // At worst, 3 sides shoot at the same time (e.g. dampeners).
    const fwbw     = Math.max(thrust.Forward  !== undefined ? thrust.Forward : 0,  thrust.Backward !== undefined ? thrust.Backward  : 0)
    const sideways = Math.max(thrust.Left     !== undefined ? thrust.Left    : 0,  thrust.Right    !== undefined ? thrust.Right     : 0)
    const updown   = Math.max(thrust.Up       !== undefined ? thrust.Up      : 0,  thrust.Down     !== undefined ? thrust.Down      : 0)
    const totalThrust = fwbw + sideways + updown
    if(totalThrust === 0) return '-'

    // Thrust-to-Fuel is between 0.75 to 0.93 . With assumption of NOT shooting 3-ways all the time, let's round optimistically up to 1.
    const consumption = totalThrust / 1000 * 1
    const time = total / consumption

    return moment.utc(time * 1000).format('mm:ss')
}

const jumpDistance = (mass: number, jumpDrives: number) => {
    const maxDistance = 2000
    const maxMass = 1250000

    if(jumpDrives === 0) return '-'

    if(maxMass * jumpDrives > mass) {
        return Math.floor(maxDistance * jumpDrives)
    } else {
        return Math.floor(maxDistance * jumpDrives * (maxMass / mass))
    }
}

const dryMass = (bp: IBpProjectionRow) => {
    return bp.sbc.blockMass
}
