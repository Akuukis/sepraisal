import { IBlueprint } from '@sepraisal/common'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import {
    AppBar,
    Card,
    CardContent,
    Divider,
    Grid,
    InputAdornment,
    MenuItem,
    Tab,
    Tabs,
    TextField,
    Typography,
} from '@material-ui/core'

import { createSmartFC, createStyles, GridSize as ColumnSize, IMyTheme } from '../../common/'


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
        backgroundColor: theme.palette.primary.light,
    },
    inline: {
        display: 'inline',
    },
    line: {
        fontFamily: '"Roboto Mono", Roboto',
    },
    tab: {
        minWidth: theme.spacing(30),
        padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
    },
})

type Type = 'component' | 'ingot' | 'ore'
interface IRequirement {
    amount: number
    blockType: string
}
interface IProps {
    bp: IBpProjectionRow
    width: ColumnSize
}


export default hot(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {
    const sbc = props.bp.sbc
    const [tab, setTab] = React.useState(0)
    const [copies, setCopies] = React.useState(1)
    const [type, setType] = React.useState<Type>('component')

    const handleTab = (event: unknown, newValue: number) => {
        setTab(newValue)
    }
    const handleType = (event: React.ChangeEvent<HTMLInputElement>) => {
        setType(event.target.value as Type)
    }
    const handleK = (event: React.ChangeEvent<HTMLInputElement>) => {
        setCopies(Number(event.target.value))
    }

    // tslint:disable: arrow-return-shorthand
    const getComponents = (): IRequirement[] => {
        return Object.entries(sbc.components)
            .map(([blockType, amount]) => ({blockType, amount: amount * copies}))
            .sort((a, b) => b.amount - a.amount)
    }

    const getIngots = (): IRequirement[] => {
        return Object.entries(sbc.ingots)
            .map(([blockType, amount]) => ({blockType, amount}))
            .sort((a, b) => b.amount - a.amount)
    }

    const getOres = (): IRequirement[] => {
        return Object.entries(sbc.ores)
            .map(([blockType, amount]) => ({blockType, amount}))
            .sort((a, b) => b.amount - a.amount)
    }

    const formatALCD2Inv = (reqs: IRequirement[]): React.ReactNode[] => {
        return reqs
            .map(({blockType, amount}) => `InvList * +${blockType}:${amount}`)
    }
    const formatALCD2Missing = (reqs: IRequirement[]): React.ReactNode[] => {
        return reqs
            .map(({blockType, amount}) => `MissingList * +${blockType}:${amount}`)
    }
    const formatIIMLcd = (reqs: IRequirement[]): React.ReactNode[] => {
        return reqs
            .map(({blockType, amount}) => `${blockType} ${amount} noHeading singleLine`)
    }
    const formatIIMCargo = (reqs: IRequirement[]): React.ReactNode[] => {
        return reqs
            .map(({blockType, amount}) => `${blockType}=+${amount}`)
    }

    const getText = (): React.ReactNode[] => {
        let format: (ids: IRequirement[]) => React.ReactNode[]
        switch(tab) {
            case 0: {
                format = formatALCD2Inv
                break
            }
            case 1: {
                format = formatALCD2Missing
                break
            }
            case 2: {
                format = formatIIMLcd
                break
            }
            case 3: {
                format = formatIIMCargo
                break
            }
            default: throw new Error('Catch me')
        }

        switch(type) {
            case 'component': return format(getComponents())
            case 'ingot': return format(getIngots())
            case 'ore': return format(getOres())
            default: throw new Error('Catch me')
        }
    }

    return (
        <Grid item xs={props.width}>
            <Card square className={classes.card}>
                <Grid container>
                    <Grid item xs={12} sm={6} className={classes.cell}>
                        <Grid container spacing={0} alignItems='center'>
                            <Grid item xs={12} sm={6} className={classes.corner}>
                                <CardContent className={classes.cardContent}>
                                    <Typography variant='body1'>{`EXPORT`}</Typography>
                                </CardContent>
                                <Divider />
                            </Grid>
                            <Grid item xs={12} sm={6} style={{padding: theme.spacing(1)}}>
                                <TextField
                                    select
                                    value={type}
                                    onChange={handleType}
                                >
                                    <MenuItem value='component'>Compoments</MenuItem>
                                    <MenuItem value='ingot'>Ingots</MenuItem>
                                    <MenuItem value='ore'>Ores</MenuItem>
                                </TextField>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6} className={classes.cell}>
                        <Grid container spacing={0} alignItems='center'>
                            <Grid item xs={12} sm={6} />
                            <Grid item xs={12} sm={6}>
                                <CardContent className={classes.cardContent}>
                                    <TextField
                                        id='copies'
                                        type='number'
                                        value={copies}
                                        onChange={handleK}
                                        InputProps={{
                                            endAdornment: <InputAdornment position='end'>Copies</InputAdornment>,
                                        }}
                                    />
                                </CardContent>
                                <Divider />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={12} className={classes.cell}>
                        <AppBar position='static' color='default'>
                            <Tabs
                                value={tab}
                                onChange={handleTab}
                                indicatorColor='primary'
                                textColor='primary'
                                variant='scrollable'
                                scrollButtons='auto'
                            >
                                <Tab className={classes.tab} label='aLCD2 Inventory' />
                                <Tab className={classes.tab} label='aLCD2 Missing' />
                                <Tab className={classes.tab} label='IIM LCD' />
                                <Tab className={classes.tab} label='IIM Cargo' />
                            </Tabs>
                        </AppBar>
                        <CardContent className={classes.cardContent} role='tabpanel' style={{overflowY: 'scroll', height: `${151 * 3}px`}}>
                            <Typography component='pre' variant='body2'>
                                {getText().join('\n')}
                            </Typography>
                        </CardContent>
                    </Grid>
                </Grid>
            </Card>
        </Grid>
    )
})) /* ============================================================================================================= */


type ProjectionCardSbc =
    | 'components'
    | 'ores'
    | 'ingots'

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
