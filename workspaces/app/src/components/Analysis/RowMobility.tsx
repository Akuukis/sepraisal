import { Direction, GridSize, IBlueprint } from '@sepraisal/common'
import * as moment from 'moment'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Card, CardContent, Divider, Grid, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, GridSize as ColumnSize, IMyTheme } from '../../common/'
import ValueWithLabel from '../../components/ValueWithLabel'
import MyRow from '../MyRow'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        padding: '0.5em',
    },

    card: {
    },
    cardContent: {
        paddingBottom: 8,
        paddingTop: 8,
    },
    cell: {
        width: '268px',
    },
    corner: {
        backgroundColor: theme.palette.secondary.main,
    },
    inline: {
        display: 'inline',
    },
})


interface IProps {
    bp: IBpProjectionRow
    width: ColumnSize
}


export default hot(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {
    const sbc = props.bp.sbc

    return (
        <Grid item xs={props.width}>
            <Card square className={classes.card}>
                <Grid container>
                    <Grid item xs={12} sm={6} className={classes.cell}>
                        <Grid container spacing={0}>
                            <Grid item xs={12} sm={6} className={classes.corner}>
                                <CardContent className={classes.cardContent}>
                                    <Typography variant='body1'>{`MOBILITY`}</Typography>
                                </CardContent>
                                <Divider />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <CardContent className={classes.cardContent}>
                                    <Typography noWrap component='span' className={classes.inline} variant='caption' color='textSecondary'>
                                        {`Grid type: `}
                                    </Typography>
                                    <Typography noWrap component='span' className={classes.inline} variant='body1'>
                                        {sbc.gridStatic ? `Static` : `Vehicle`}
                                    </Typography>
                                </CardContent>
                                <Divider />
                            </Grid>
                        </Grid>
                        <MyRow>
                            <ValueWithLabel label={`mass (t)`} value={`${(sbc.blockMass / 1000).toFixed(0)} k`} />
                            <ValueWithLabel label={`gyros`} value={`${gyros(sbc.blockMass, sbc.gridSize, sbc.blocks)}`} />
                            <ValueWithLabel label={`j.drives`} value={`${'JumpDrive/LargeJumpDrive' in sbc.blocks ? sbc.blocks['JumpDrive/LargeJumpDrive'] : '-'}`} />
                            <ValueWithLabel label={`t.vel. (m/s)`} value={`${terminalVelocity(sbc.blockMass, sbc.gridSize, sbc.blocks)}`} />
                        </MyRow>
                        <MyRow>
                            <ValueWithLabel label={`(m/s\u00B2)`} value={`Hydro:`} />
                            <ValueWithLabel label={`average`} value={speedToFixed(averageThrust(sbc.thrustHydrogen), sbc.blockMass, 1)} />
                            <ValueWithLabel label={`forward`} value={speedToFixed(sbc.thrustHydrogen.Forward, sbc.blockMass, 2)} />
                            <ValueWithLabel label={`fuel\u2009(min)`} value={hydroFuel(sbc.gridSize, sbc.blocks, sbc.thrustHydrogen)} />
                        </MyRow>
                    </Grid>
                    <Grid item xs={12} sm={6} className={classes.cell}>
                        <CardContent className={classes.cardContent}>
                            <Typography noWrap component='span' className={classes.inline} variant='caption' color='textSecondary'>
                                {`Wheels: `}
                            </Typography>
                            <Typography noWrap component='span' className={classes.inline} variant='body1'>
                                {wheeled(sbc.blocks)}
                            </Typography>
                        </CardContent>
                        <Divider />
                        <MyRow>
                            <ValueWithLabel label={`(m/s\u00B2)`} value={`Atmo:`} />
                            <ValueWithLabel label={`average`} value={speedToFixed(averageThrust(sbc.thrustAtmospheric), sbc.blockMass, 1)} />
                            <ValueWithLabel label={`forward`} value={speedToFixed(sbc.thrustAtmospheric.Forward, sbc.blockMass, 2)} />
                            <ValueWithLabel label={`upward`} value={speedToFixed(sbc.thrustAtmospheric.Up, sbc.blockMass, 2)} />
                        </MyRow>
                        <MyRow>
                            <ValueWithLabel label={`(m/s\u00B2)`} value={`Ion:`} />
                            <ValueWithLabel label={`average`} value={speedToFixed(averageThrust(sbc.thrustIon), sbc.blockMass, 1)} />
                            <ValueWithLabel label={`forward`} value={speedToFixed(sbc.thrustIon.Forward, sbc.blockMass, 2)} />
                            <ValueWithLabel label={`backward`} value={speedToFixed(sbc.thrustIon.Backward, sbc.blockMass, 2)} />
                        </MyRow>
                    </Grid>
                </Grid>
            </Card>
        </Grid>
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

const speedToFixed = (speed: number | undefined, mass: number, toFixed: number = 2) => {
    if(speed === undefined || speed === 0) return '-'

    return `${(speed / mass).toFixed(toFixed)}`
}

const gyros = (mass: number, gridSize: GridSize, blocks: Partial<Record<string, number>>, toFixed: number = 2) => {
    const result = blocks[gridSize === 'Small' ? 'Gyro/SmallBlockGyro' : 'Gyro/LargeBlockGyro']
    if(result === undefined) return '-'

    // TODO: Calculate °/s .
    // const forceMagnitude = gridSize === 'Small' ? 3.36 * 10000000 : 448000  // = Torque
    // const force = gyros * forceMagnitude

    return result
}

const terminalVelocity = (mass: number, gridSize: GridSize, blocks: {'Parachute/LgParachute'?: number, 'Parachute/SmParachute'?: number}, toFixed: number = 2) => {
    const blockSize = gridSize === 'Small' ? 0.5 : 2.5
    const hatches = blocks[gridSize === 'Small' ? 'Parachute/SmParachute' : 'Parachute/LgParachute']
    if(hatches === undefined || hatches === 0) return '-'

    const RADMULT = 8  // radius multiplier
    const REEFLEVEL = 0.6  // reefing level
    const CD = 1  // drag coefficient


    const GRAVITY = 9.81 // (we'll say this is an Earth-like planet)
    const ATM = 0.85 // (avoid using 1.0 - 0.85 gives a more conservative result)

    const diameter = (Math.log(((ATM - REEFLEVEL) * 10) - 0.99) + 5) * RADMULT * blockSize
        // = (log((10*(0.85-0.6))-0.99)+5)*8*2.5
        // = 103.6

    const area = Math.PI * Math.pow(diameter / 2, 2)
        // = 8,429.6

    const result = Math.sqrt((mass * GRAVITY) / (area * CD * hatches * ATM * 1.225 * 2.5))
        // = squareroot((2927310*9.81)/(8429.6*1.0*10*0.85*1.225*2.5))
        // = 11.4 m/s

    return result.toFixed(toFixed)
}

const wheeled = (blocks: Record<string, number>) => {
    const entries = Object.entries(blocks)
    const x1 = entries.filter(([cube]) => cube.includes('Suspension1x1')).reduce((sum, [, count]) => sum + count, 0)
    const x3 = entries.filter(([cube]) => cube.includes('Suspension3x3')).reduce((sum, [, count]) => sum + count, 0)
    const x5 = entries.filter(([cube]) => cube.includes('Suspension5x5')).reduce((sum, [, count]) => sum + count, 0)

    if(x1 + x3 + x5 === 0) return 'No'

    return [
            'Yes ',
            x1 === 0 ? undefined : `${x1} small`,
            x3 === 0 ? undefined : `${x3} medium`,
            x5 === 0 ? undefined : `${x5} large`,
        ]
        .filter((val) => val !== undefined)
        .join(', ')
}

// tslint:disable-next-line: mccabe-complexity
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
