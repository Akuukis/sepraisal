import { Direction, GroupTitle, IBlueprint, mapToRecord, ObservableMap, VENDOR_MOD } from '@sepraisal/common'
import fromEntries from 'object.fromentries'

import { Blueprint, Component, Cube, Group, ICoords, Ingot, Ore, Orientation, TranslationMinEnum } from './models'
import { Block } from './models/Block'
import {
    SIMILAR_HEAVY_ARMOR,
    SIMILAR_INTERIOR_LIGHT,
    SIMILAR_LIGHT_ARMOR,
    SIMILAR_TEXT_PANEL,
    SIMILAR_WINDOW,
} from './similarBlocks'
import { BlueprintBlockDirectionEnum } from './xmlns/BlueprintDefinition'
import { CubeDTO } from './xmlns/CubeDefinition'
import { CubeType } from './xmlns/CubeType'

// TODO: Split this grown-too-big-god-class.
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-non-null-assertion */


export type MaterialMap = ObservableMap<Component> | ObservableMap<Ingot> | ObservableMap<Ore> | ObservableMap<Cube>

export interface IAnalysisSources {
        components: ObservableMap<Component>
        cubes: ObservableMap<Cube>
        ingots: ObservableMap<Ingot>
        ores: ObservableMap<Ore>
}

const getMaterialAll = (outerEntries: Array<[Cube | Component | Ingot, number]>): Record<string, number> => {
    const struct = Object.create(null) as Record<string, number>
    for(const [material, outerCount] of outerEntries) {
        for(const [innerName, innerCount] of Object.entries(material.prerequisites)) {
            struct[innerName] = (innerName in struct ? struct[innerName] : 0) + outerCount * innerCount
        }
    }
    for(const [key, value] of Object.entries(struct)) {
        struct[key] = Math.round(value)
    }

    return struct
}

const getMaterials = (struct: Record<string, number>, store: MaterialMap): Record<string, number> => {
    const result = Object.create(null) as Record<string, number>
    for(const [name, count] of Object.entries(struct)) {
        if(store.has(name)) result[name] = count
    }

    return result
}

const getMaterialsError = (struct: Record<string, number>, store: MaterialMap): Record<string, number> => {
    const result = Object.create(null) as Record<string, number>
    for(const [name, count] of Object.entries(struct)) {
        if(!store.has(name)) result[name] = count
    }

    return result
}

const squeezePraisal = (praisal: Praisal): IBlueprint.IMaterialGroup =>
    ({
        blockCount: Math.round(praisal.blockCount),
        blockMass: Math.round(praisal.blockMass),
        blockPCU: Math.round(praisal.blockPCU),
        oreVolume: Math.round(praisal.oreVolume),
    })

export class Praisal {

    public get blockAll(): Record<string, number> {
        return this.blummary.blocks
            .map((cubeBlock) => cubeBlock.title)
            .reduce((blockcountMap, block) => {
                if(!(block in blockcountMap)) blockcountMap[block] = 0
                blockcountMap[block] += 1

                return blockcountMap
            }, Object.create(null) as Record<string, number>)
    }


    public get blockCount()     { return this.blocks.reduce((sum, [, count]) => sum + count, 0)}

    public get blockErrorsStruct() { return getMaterialsError(this.blockAll, this.cubeDefs) }
    public get blockIntegrity() { return this.blocks.reduce((sum, [material, count]) => sum + material.integrity * count, 0)}
    public get blockMass()      { return this.blocks.reduce((sum, [material, count]) => sum + material.mass * count, 0)}
    public get blockPCU()       { return this.blocks.reduce((sum, [material, count]) => sum + material.pcu * count, 0)}

    public get blocks()     { return Object.entries(this.blockStruct).map<[Cube    , number]>(([name, count]) => [this.cubeDefs.get(name)!    , count]) }

    public get blocksErrors() { return Object.entries(this.blockErrorsStruct) }

    public get blockStruct() { return getMaterials(this.blockAll, this.cubeDefs) }
    public get blockTime()      { return this.blocks.reduce((sum, [material, count]) => sum + material.time * count, 0)}
    public get blockVolume()    { return this.blocks.reduce((sum, [material, count]) => sum + material.volume * count, 0)}
    public get componentAll() { return getMaterialAll(this.blocks) }

    public get componentCount()  { return this.components.reduce((sum, [, count]) => sum + count, 0)}
    public get componentErrors() { return Object.entries(this.componentErrorsStruct) }
    public get componentErrorsStruct() { return getMaterialsError(this.componentAll, this.componentDefs) }
    public get componentMass()   { return this.components.reduce((sum, [material, count]) => sum + material.mass * count, 0)}
    public get components() { return Object.entries(this.componentStruct).map<[Component, number]>(([name, count]) => [this.componentDefs.get(name)!, count]) }
    public get componentStruct() { return getMaterials(this.componentAll, this.componentDefs) }
    public get componentTime()   { return this.components.reduce((sum, [material, count]) => sum + material.time * count, 0)}
    public get componentVolume() { return this.components.reduce((sum, [material, count]) => sum + material.volume * count, 0)}

    public get densitySpaceDomain() {
        const space = this.integritySpace // this.densitySpace(()=>1)
        const min: ICoords = {x:  1000, y:  1000, z:  1000}
        const max: ICoords = {x: -1000, y: -1000, z: -1000}
        for(const [[x, y, z]] of space.entries()) {
            min.x = Math.min(min.x, x)
            min.y = Math.min(min.y, y)
            min.z = Math.min(min.z, z)

            max.x = Math.max(max.x, x)
            max.y = Math.max(max.y, y)
            max.z = Math.max(max.z, z)
        }

        const topRef = this.orientation.turnUp().turnRight()
        const rotated = topRef.translate(max).x - topRef.translate(min).x < topRef.translate(max).y - topRef.translate(min).y
        // console.log(min, max, rotated)

        return {
            max,
            min,
            rotated,
        }
    }
    public get ingotAll() { return getMaterialAll(this.components) }

    public get ingotCount()  { return this.ingots.reduce((sum, [, count]) => sum + count, 0)}
    public get ingotErrors() { return Object.entries(this.ingotErrorsStruct) }
    public get ingotErrorsStruct() { return getMaterialsError(this.ingotAll, this.ingotDefs) }
    public get ingotMass()   { return this.ingots.reduce((sum, [material, count]) => sum + material.mass * count, 0)}
    public get ingots()     { return Object.entries(this.ingotStruct).map<[Ingot    , number]>(([name, count]) => [this.ingotDefs.get(name)!    , count]) }
    public get ingotStruct() { return getMaterials(this.ingotAll, this.ingotDefs) }
    public get ingotTime()   { return this.ingots.reduce((sum, [material, count]) => sum + material.time * count, 0)}
    public get ingotVolume() { return this.ingots.reduce((sum, [material, count]) => sum + material.volume * count, 0)}

    public get integrityPlanes() {
        const space = this.integritySpace

        return this.flattenSpace(space)
    }

    public get integritySpace() { return this.densitySpace((block) => block.integrity !== null ? block.integrity : 0) }
    public get oreAll() { return getMaterialAll(this.ingots) }

    public get oreCount()  { return this.ores.reduce((sum, [, count]) => sum + count, 0)}
    public get oreErrors() { return Object.entries(this.oreErrorsStruct) }
    public get oreErrorsStruct() { return getMaterialsError(this.oreAll, this.oreDefs) }
    public get oreMass()   { return this.ores.reduce((sum, [material, count]) => sum + material.mass * count, 0)}
    public get ores()       { return Object.entries(this.oreStruct).map<[Ore      , number]>(([name, count]) => [this.oreDefs.get(name)!      , count]) }
    public get oreStruct() { return getMaterials(this.oreAll, this.oreDefs) }
    public get oreVolume() { return this.ores.reduce((sum, [material, count]) => sum + material.volume * count, 0)}

    public get orientation() {
        const referenceBlocks = this.blummary.blocks
            .filter(Block.isType(CubeType.Cockpit))
            .filter((block) => block.subtype !== null && !block.subtype.includes('PassengerSeat'))
        if(referenceBlocks.length === 1) return new Orientation(referenceBlocks[0].forward, referenceBlocks[0].up)

        const main = referenceBlocks.find((block) => block.data.IsMainCockpit ? block.data.IsMainCockpit[0] === 'true' : false)
        if(main) return new Orientation(main.forward, main.up)

        // console.warn(`Default Orientation!`, referenceBlocks)
        return new Orientation(Direction.Forward, Direction.Up)
    }

    public get thrustAtmospheric() { return this.thrust('Atmospheric') }
    public get thrustHydrogen() { return this.thrust('Hydrogen') }
    public get thrustIon() { return this.thrust('Ion') }
    public readonly blummary: Blueprint
    public readonly componentDefs: ObservableMap<Component>
    public readonly cubeDefs: ObservableMap<Cube>
    public readonly groups?: Map<GroupTitle, Praisal>
    public readonly ingotDefs: ObservableMap<Ingot>
    public readonly oreDefs: ObservableMap<Ore>


    public constructor(blueprint: Blueprint, sources: IAnalysisSources, groupDefs?: ObservableMap<Group>) {
        this.blummary = blueprint
        this.cubeDefs = sources.cubes
        this.componentDefs = sources.components
        this.ingotDefs = sources.ingots
        this.oreDefs = sources.ores

        if(groupDefs === undefined) return this

        const groups = new Map<GroupTitle, Praisal>()

        const groupsOrdered = [...groupDefs.values()]
            .sort((a, b) => b.priority - a.priority)  // Higher priority first.

        let leftoverBlueprint = blueprint
        for(const group of groupsOrdered) {
            const matchedBlueprint = new Blueprint(leftoverBlueprint)
            const otherBlueprint = new Blueprint(leftoverBlueprint)
            leftoverBlueprint.grids.forEach((grid, i) => {
                const {matched, other} = group.match(leftoverBlueprint.grids[i].blocks)
                matchedBlueprint.grids[i].blocks = matched
                otherBlueprint.grids[i].blocks = other
            })

            groups.set(group.title, new Praisal(matchedBlueprint, sources, undefined))
            leftoverBlueprint = otherBlueprint
        }

        this.groups = groups
    }

    public densitySpace(getDensity: (block: Block) => number) {
        const space = new Map<[number, number, number], number>()

        for(const block of this.blummary.blocks) {
            const {x, y, z, size} = block
            const orientation = new Orientation(block.forward, block.up)
            if(!size || block.integrity === null) continue

            if(size.X === 1 && size.Y === 1 && size. Z === 1) {
                space.set([x, y, z], getDensity(block))
                continue
            }

            const density = Math.floor(block.integrity / size.X / size.Y / size.Z)
            for(const X of Array(size.X).keys()) {
                for(const Y of Array(size.Y).keys()) {
                    for(const Z of Array(size.Z).keys()) {
                        const tmp: Record<TranslationMinEnum, number> = {x: X, y: Y, z: Z}
                        const translation = orientation.translateForMin()
                        space.set([x + tmp[translation.x], y + tmp[translation.y], z + tmp[translation.z]], density)
                    }
                }
            }

        }

        return space
    }

    public drawCanvas(space: Map<[number, number, number], number>, get: Orientation) {
        const {min, max} = this.densitySpaceDomain

        const width  = Math.abs(get.x(max) - get.x(min)) + 1
        const height = Math.abs(get.y(max) - get.y(min)) + 1
        const canva: number[][] = Array(height).fill(null).map(() => Array(width).fill(0))

        for(const [[xRaw, yRaw, zRaw], value] of space.entries()) {
            const coords = {x: xRaw, y: yRaw, z: zRaw}
            const x = get.x(coords) - get.x(min) + (get.x() > 0 ? 0 : width - 1)
            const y = get.y(coords) - get.y(min) + (get.y() > 0 ? 0 : height - 1)
            canva[y][x] += value
        }

        return canva
    }

    public flattenSpace(space: Map<[number, number, number], number>) {
        const {rotated} = this.densitySpaceDomain

        const front = this.drawCanvas(space, this.orientation.turnAround())  // Front view
        const side = this.drawCanvas(space, this.orientation.turnRight())  // Right view
        const topRef = this.orientation.turnUp().turnRight()
        const top = this.drawCanvas(space, rotated ? topRef.turnRight() : topRef)  // Top view

        const maxValue = ([] as number[])
            .concat(...front)
            .concat(...side)
            .concat(...top)
            .reduce((max, value) => Math.max(max, value), 0)

        return {
            front,
            maxValue,
            rotated,
            side,
            top,
        }
    }

    public previewPlanes() {
        const {front, side, top} = this.integrityPlanes

        const draw = (canva: number[][]) => canva.reduceRight(
            (output, line) => `${output}${line.reduce(
                (i, val) => i + (val > 0 ? String.fromCharCode(Math.round(val / 50000) + 65) : '.'), '')}\n`, '')

        return {
            front: draw(front),
            side: draw(side),
            top: draw(top),
        }

    }

    public toBlueprintSbc(revision: number): IBlueprint.ISbc {

        // TODO: fix after adding mod support.
        const vanilla = this.blocksErrors.length === 0
            && this.componentErrors.length === 0
            && this.ingotErrors.length === 0
            && this.oreErrors.length === 0

        const blockCountTotal = this.blockCount + this.blocksErrors.reduce((sum, [, count]) => sum + count, 0)

        const missingDefinitions: IBlueprint.IDefinitions = {
            blocks: fromEntries(this.blocksErrors),
            components: fromEntries(this.componentErrors),
            ingots: fromEntries(this.ingotErrors),
            ores: fromEntries(this.oreErrors),
        }

        const dlcs = new Set<VENDOR_MOD>()
        const blocks = Object.create(null) as Record<string, number>
        Object.entries(this.blockAll).forEach(([key, count]) => {
            const cube = this.cubeDefs.get(key)
            if(!cube) return

            // Merge some similar blocks to lower spam.
            let realKey = key
            if(SIMILAR_WINDOW.includes(key)) realKey = '<Vanilla Window blocks>'
            if(SIMILAR_LIGHT_ARMOR.includes(key)) realKey = '<Vanilla Light Armor blocks>'
            if(SIMILAR_HEAVY_ARMOR.includes(key)) realKey = '<Vanilla Heavy Armor blocks>'
            if(SIMILAR_INTERIOR_LIGHT.includes(key)) realKey = '<Vanilla Interior Light blocks>'
            if(SIMILAR_TEXT_PANEL.includes(key)) realKey = '<Vanilla Text Panel blocks>'

            blocks[realKey] = (realKey in blocks ? blocks[realKey] : 0) + count
            dlcs.add(cube.mod)
        })

        const components = Object.create(null) as Record<string, number>
        for (const [key, comp] of Object.entries(this.componentAll)) components[key.split('/').pop()!] = comp
        const ores = Object.create(null) as Record<string, number>
        for(const [key, ore] of Object.entries(this.oreAll)) ores[key.split('/').pop()!] = ore
        const ingots = Object.create(null) as Record<string, number>
        for(const [key, ingot] of Object.entries(this.ingotAll)) ingots[key.split('/').pop()!] = ingot

        const flagsRed: IBlueprint.Flags<""> = []
        const flagsYellow: IBlueprint.Flags<""> = []
        const flagsGreen: IBlueprint.Flags<""> = []

        const blockSize = this.blummary.gridSize === 'Small' ? 0.5 : 2.5
        const integrityPlanes = this.integrityPlanes
        const length = integrityPlanes.top[0].length * blockSize
        const width = integrityPlanes.top.length * blockSize
        const height = integrityPlanes.side.length * blockSize

        const missingDefinitionsCount = 0
            + Object.keys(missingDefinitions.blocks).length
            + Object.keys(missingDefinitions.components).length
            + Object.keys(missingDefinitions.ingots).length
            + Object.keys(missingDefinitions.ores).length
        const DLCsCount = dlcs.size - 1  // Minus Vanilla.
        const flagsRedCount = flagsRed.length
        const flagsYellowCount = flagsYellow.length
        const flagsGreenCount = flagsGreen.length

        return {
            gridTitle: this.blummary.title,
            sizeMB: Math.round(this.blummary.originalSize / 1000 / 1000 * 100) / 100,

            missingDefinitions,
            missingDefinitionsCount,
            vanilla,
            DLCs: [...dlcs.values()].filter((dlc) => dlc !== VENDOR_MOD.VANILLA),
            DLCsCount,
            blocks,
            components,
            ingots,
            ores,
            blockCountTotal,

            _revision: revision,
            _version: IBlueprint.VERSION.sbc,
            flagsGreen,
            flagsRed,
            flagsYellow,
            flagsRedCount,
            flagsYellowCount,
            flagsGreenCount,
            gridCount: this.blummary.grids.length,
            gridSize: this.blummary.gridSize,
            gridStatic: this.blummary.hasStaticGrid,

            orientation: this.orientation,
            integrityPlanes: this.integrityPlanes,
            length,
            width,
            height,

            thrustAtmospheric: mapToRecord(this.thrustAtmospheric),
            thrustHydrogen: mapToRecord(this.thrustHydrogen),
            thrustIon: mapToRecord(this.thrustIon),

            ...squeezePraisal(this),
            blockIntegrity: Math.round(this.blockIntegrity),
            blockTime: Math.round(this.blockTime),
            blockVolume: Math.round(this.blockVolume),
            componentCount: Math.round(this.componentCount),
            componentMass: Math.round(this.componentMass),
            componentTime: Math.round(this.componentTime),
            componentVolume: Math.round(this.componentVolume),
            ingotCount: Math.round(this.ingotCount),
            ingotMass: Math.round(this.ingotMass),
            ingotTime: Math.round(this.ingotTime),
            ingotVolume: Math.round(this.ingotVolume),
            oreCount: Math.round(this.oreCount),
            oreMass: Math.round(this.oreMass),

            // groupControl:        squeezePraisal(this.groups!.get(GroupTitle.Control)!),
            // groupLifeSupport:    squeezePraisal(this.groups!.get(GroupTitle.LifeSupport)!),
            // groupMechanical:     squeezePraisal(this.groups!.get(GroupTitle.Mechanical)!),
            // groupMobility:       squeezePraisal(this.groups!.get(GroupTitle.Mobility)!),
            // groupOther:          squeezePraisal(this.groups!.get(GroupTitle.Other)!),
            // groupPower:          squeezePraisal(this.groups!.get(GroupTitle.Power)!),
            // groupProduction:     squeezePraisal(this.groups!.get(GroupTitle.Production)!),
            // groupStructure:      squeezePraisal(this.groups!.get(GroupTitle.Structure)!),
            // groupWeapons:        squeezePraisal(this.groups!.get(GroupTitle.Weapons)!),
        }
    }


    private thrust(type: CubeDTO.IThrust['ThrusterType'][0]) {
        const thrust = new Map<BlueprintBlockDirectionEnum, number>()

        for(const block of this.blummary.blocks) {
            if(!block.isType(CubeType.Thrust)) continue

            const {cube} = block
            if(!cube) continue
            if(cube.data.ThrusterType[0] !== type) continue

            const {Forward} = new Orientation(block.forward, block.up).turnAround()
            thrust.set(Forward, (thrust.has(Forward) ? thrust.get(Forward)! : 0) + Number(cube.data.ForceMagnitude[0]))
        }

        return thrust
    }
}

export interface IAnalysisRowProps {
    analysis: Praisal
}
