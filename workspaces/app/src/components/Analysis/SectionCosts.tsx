import { IBlueprint } from '@sepraisal/common'
import { Component } from '@sepraisal/praisal'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { createSmartFC, createStyles, formatDecimal, formatDuration, IMyTheme } from '../../common/'
import ValueCell from '../../components/Cell/ValueCell'
import { CONTEXT } from '../../stores'
import HeaderCell from '../Cell/HeaderCell'
import LegendCell from '../Cell/LegendCell'
import MyBox from '../MyBox'
import MyBoxColumn from '../MyBoxColumn'
import MyBoxRow from '../MyBoxRow'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },
})


interface IProps {
    bp: IBpProjectionRow
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {sbc} = props.bp

    const praisalManager = React.useContext(CONTEXT.PRAISAL_MANAGER)
    const getComponent = (name: string) => praisalManager.components.get(`Component/${name}`) ?? {} as Component

    const materials = getCombinedMaterials(sbc)

    const components = Object.entries(sbc.components).map(([type, components]) => ({type, components}))

    const componentCount = components.reduce((sum, entry) => sum + entry.components, 0)
    const componentMass = components.reduce((sum, entry) => sum + getComponent(entry.type).mass * entry.components, 0)
    const componentVolume = components.reduce((sum, entry) => sum + getComponent(entry.type).volume * entry.components, 0)


    return (
        <>
            <MyBoxColumn height={3} width={3}>
                <MyBoxRow width={3}>
                    <MyBox variant='header'>
                        <HeaderCell title='COSTS' />
                    </MyBox>
                    <MyBox>
                        <ValueCell label='PCU' value={formatDecimal(sbc.blockPCU)} />
                    </MyBox>
                </MyBoxRow>
                <MyBoxRow width={3}>
                    <MyBox>
                        <ValueCell label='grids' value={formatDecimal(sbc.gridCount)} />
                    </MyBox>
                    <MyBox>
                        <ValueCell label='blocks' value={formatDecimal(sbc.blockCount)} />
                    </MyBox>
                    <MyBox>
                        <ValueCell label='components' value={formatDecimal(componentCount)} />
                    </MyBox>
                </MyBoxRow>
                <MyBoxRow width={3}>
                    <MyBox width={3}>
                        <ValueCell label='welder time' value={formatDuration(sbc.blockTime)} />
                        <ValueCell label='assembler time' value={formatDuration(sbc.componentTime)} />
                        <ValueCell label='refinery time' value={formatDuration(sbc.ingotTime)} />
                    </MyBox>
                </MyBoxRow>
            </MyBoxColumn>
            <MyBoxColumn height={3} width={3}>
                <MyBoxRow width={3}>
                    <MyBox width={3}>
                        <LegendCell legend='Components' legendProps={{align: 'right'}} />
                        <ValueCell label='mass (kg)' value={formatDecimal(componentMass)} />
                        <ValueCell label='volume (l)' value={formatDecimal(componentVolume)} />
                    </MyBox>
                </MyBoxRow>
                <MyBoxRow width={3}>
                    <MyBox width={3}>
                        <LegendCell legend='Ingots' legendProps={{align: 'right'}} />
                        <ValueCell label='mass (kg)' value={formatDecimal(getIngotMass(materials))} />
                        <ValueCell label='volume (l)' value={formatDecimal(getIngotVolume(materials))} />
                    </MyBox>
                </MyBoxRow>
                <MyBoxRow width={3}>
                    <MyBox width={3}>
                        <LegendCell legend='Ores' legendProps={{align: 'right'}} />
                        <ValueCell label='mass (kg)' value={formatDecimal(getOreMass(materials))} />
                        <ValueCell label='volume (l)' value={formatDecimal(getOreVolume(materials))} />
                    </MyBox>
                </MyBoxRow>
            </MyBoxColumn>
        </>
    )
})) /* ============================================================================================================= */


type ProjectionCardSbc =
    | 'blockCount'
    | 'blockPCU'
    | 'blockTime'
    | 'componentTime'
    | 'components'
    | 'gridCount'
    | 'ingotTime'
    | 'ingots'
    | 'ores'

interface IBpProjectionRow {
    sbc: {[key in keyof Pick<IBlueprint.ISbc, ProjectionCardSbc>]: IBlueprint.ISbc[key]},
}

const INGOT_VOLUME = {
    Stone: 0.37,
    Iron: 0.127,
    Nickel: 0.112,
    Cobalt: 0.112,
    Magnesium: 0.575,
    Silicon: 0.429,
    Silver: 0.095,
    Gold: 0.052,
    Platinum: 0.047,
    Uranium: 0.052,
} as const

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
const getOreVolume = (combined: IMaterial[]) => combined.reduce((sum, entry) => sum + entry.ores * 0.37, 0)
const getIngotMass = (combined: IMaterial[]) => combined.reduce((sum, entry) => sum + entry.ingots, 0)
const getIngotVolume = (combined: IMaterial[]) => combined.reduce((sum, entry) => sum + entry.ingots * INGOT_VOLUME[entry.type], 0)
