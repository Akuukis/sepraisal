import { IBlueprint } from '@sepraisal/common'
import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { InputAdornment, MenuItem, TextField, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, formatDecimal, IMyTheme } from 'src/common'
import Table from 'src/components/Table'

import CenterCell from '../Cell/CenterCell'
import MyBox from '../MyBox'
import MyBoxColumn from '../MyBoxColumn'
import MyBoxRow from '../MyBoxRow'
import MySection from './MySection'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    contentText: {
        paddingBottom: theme.spacing(2),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingTop: theme.spacing(2),
        width: '100%',
        overflowY: 'scroll',
    },

    contentTable: {
        width: '100%',
    },

})

type Type = 'component' | 'ingot' | 'ore'
type Syntax = 'list' | 'aLcdInv' | 'aLcdMissing' | 'iimLCD' | 'iimCargo'

interface IRequirement {
    amount: number
    blockType: string
}
interface IProps extends Omit<React.ComponentProps<typeof MySection>, 'heading' | 'value' | 'label'> {
    bp: IBpProjectionRow
    long?: boolean
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {bp, className, long, ...otherProps} = props
    const {sbc} = bp
    const [syntax, setSyntax] = React.useState<Syntax>('list')
    const [copies, setCopies] = React.useState(1)
    const [type, setType] = React.useState<Type>('component')

    const handleSyntax = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSyntax(event.target.value as Syntax)
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
            .map(([blockType, amount]) => ({blockType, amount: amount * copies}))
            .sort((a, b) => b.amount - a.amount)
    }

    const getOres = (): IRequirement[] => {
        return Object.entries(sbc.ores)
            .map(([blockType, amount]) => ({blockType, amount: amount * copies}))
            .sort((a, b) => b.amount - a.amount)
    }

    const formatList = (reqs: IRequirement[]): React.ReactNode => {
        const combinedTitles = {
            amount: 'Amount',
            blockType: 'Type',
        }

        return (
            <Table
                className={classes.contentTable}
                columns={Object.keys(combinedTitles)}
                headers={combinedTitles}
                data={reqs}
            />
        )
    }
    const formatALCD2Inv = (reqs: IRequirement[]): string => {
        return reqs
            .map(({blockType, amount}) => `InvList * +${blockType}:${amount}`)
            .join('\n')
    }
    const formatALCD2Missing = (reqs: IRequirement[]): string => {
        return reqs
            .map(({blockType, amount}) => `MissingList * +${blockType}:${amount}`)
            .join('\n')
    }
    const formatIIMLcd = (reqs: IRequirement[]): string => {
        return reqs
            .map(({blockType, amount}) => `${blockType} ${amount} noHeading singleLine`)
            .join('\n')
    }
    const formatIIMCargo = (reqs: IRequirement[]): string => {
        return reqs
            .map(({blockType, amount}) => `${blockType}=+${amount}`)
            .join('\n')
    }

    const wrapText = (formatter: (reqs: IRequirement[]) => string) => (ids: IRequirement[]): React.ReactNode => {
        return (
            <Typography className={classes.contentText} component='pre' variant='body2'>
                {formatter(ids)}
            </Typography>
        )
    }

    const getContent = (): React.ReactNode => {
        let format: (ids: IRequirement[]) => React.ReactNode
        switch(syntax) {
            case 'list': {
                format = formatList
                break
            }
            case 'aLcdInv': {
                format = wrapText(formatALCD2Inv)
                break
            }
            case 'aLcdMissing': {
                format = wrapText(formatALCD2Missing)
                break
            }
            case 'iimLCD': {
                format = wrapText(formatIIMLcd)
                break
            }
            case 'iimCargo': {
                format = wrapText(formatIIMCargo)
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
        <MySection
            heading='Materials'
            label='ore mass (kg)'
            value={formatDecimal(getOreMass(getCombinedMaterials(sbc)))}
            className={clsx(classes.root, className)} {...otherProps}
        >
            <MyBoxColumn width={3}>
                <MyBoxRow width={3}>
                    <MyBox width={3}>
                        <CenterCell width={3} padded>
                            <TextField
                                select
                                value={syntax}
                                onChange={handleSyntax}
                                fullWidth
                            >
                                <MenuItem value='list'>List</MenuItem>
                                <MenuItem value='aLcdInv'>aLCD2 Inventory</MenuItem>
                                <MenuItem value='aLcdMissing'>aLCD2 Missing</MenuItem>
                                <MenuItem value='iimLCD'>IIM LCD</MenuItem>
                                <MenuItem value='iimCargo'>IIM Cargo</MenuItem>
                            </TextField>
                        </CenterCell>
                    </MyBox>
                </MyBoxRow>
            </MyBoxColumn>
            <MyBoxColumn width={6}>
                <MyBoxRow width={6}>
                    <MyBox width={3}>
                        <CenterCell width={3} padded>
                            <TextField
                                select
                                value={type}
                                onChange={handleType}
                                fullWidth
                            >
                                <MenuItem value='component'>Compoments</MenuItem>
                                <MenuItem value='ingot'>Ingots</MenuItem>
                                <MenuItem value='ore'>Ores</MenuItem>
                            </TextField>
                        </CenterCell>
                    </MyBox>
                    <MyBox width={3}>
                        <CenterCell width={3} padded>
                            <TextField
                                id='copies'
                                type='number'
                                value={copies}
                                onChange={handleK}
                                fullWidth
                                inputProps={{
                                    style: {textAlign: 'center'},
                                }}
                                InputProps={{
                                    endAdornment: <InputAdornment position='end'>Copies</InputAdornment>,
                                }}
                            />
                        </CenterCell>
                    </MyBox>
                </MyBoxRow>
            </MyBoxColumn>
            <MyBoxColumn height={long ? 0 : 4}>
                <MyBoxRow width={6}>
                    <MyBox width={6}>
                        {getContent()}
                    </MyBox>
                </MyBoxRow>
            </MyBoxColumn>
        </MySection>
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

interface IMaterial {
    type: keyof IBlueprint.ISbc['ingots']
    ingots: number
    ores: number
}

const getCombinedMaterials = (sbc: Pick<IBlueprint.ISbc, 'ingots' | 'ores'>): IMaterial[] => {
    return Object.entries(sbc.ingots)
        .map(([type, amount]) => ({type, ingots: amount, ores: sbc.ores[type]}))
        .sort((a, b) => b.ores - a.ores)
}

const getOreMass = (combined: IMaterial[]) => combined.reduce((sum, entry) => sum + entry.ores, 0)
