import { BLOCK_GROUPS, ObservableMap, VENDOR_MOD } from '@sepraisal/common'
import { action, runInAction } from 'mobx'

import { Blueprint, Component, Cube, Group, Ingot, Ore } from './models'
import {
    IParseBlueprintSbc,
    IParseComponentSbc,
    IParseCubeBlocksSbc,
    IParsePhysicalItemsSbc,
    parseBlueprintSbc,
    parseComponentSbc,
    parseCubeBlocksSbc,
    parsePhysicalItemsSbc,
} from './parsers'
import { Praisal } from './Praisal'

// tslint:disable-next-line: min-class-cohesion
export class PraisalManager {
    private readonly blueprintSbcs = new ObservableMap<IParseBlueprintSbc>()
    private readonly physicalItemSbcs = new ObservableMap<IParsePhysicalItemsSbc>()
    private readonly componentSbcs = new ObservableMap<IParseComponentSbc>()
    private readonly cubeBlocksSbcs = new ObservableMap<IParseCubeBlocksSbc>()

    public readonly components = new ObservableMap<Component>()
    public readonly ingots = new ObservableMap<Ingot>()
    public readonly ores = new ObservableMap<Ore>()

    public readonly cubes = new ObservableMap<Cube>()

    public readonly groups = new ObservableMap<Group>()

    public async addBlueprintsSbc(blueprintsSbc: string, mod: VENDOR_MOD): Promise<void> {
        const blueprintSbcs = await parseBlueprintSbc(blueprintsSbc, mod)
        runInAction('PraisalManager.addBlueprintsSbc', () => {
            this.blueprintSbcs.merge(blueprintSbcs.map((sbc) => [sbc.fullType, sbc]))
        })
    }
    public async addComponentsSbc(componentsSbc: string, mod: VENDOR_MOD): Promise<void> {
        const componentsSbcs = await parseComponentSbc(componentsSbc, mod)
        runInAction('PraisalManager.addComponentsSbc', () => {
            this.componentSbcs.merge(componentsSbcs.map((sbc) => [sbc.fullType, sbc]))
        })
    }
    public async addPhysicalItemsSbc(physicalItemsSbc: string, mod: VENDOR_MOD): Promise<void> {
        const physicalItemsSbcs = await parsePhysicalItemsSbc(physicalItemsSbc, mod)
        runInAction('PraisalManager.addPhysicalItemsSbc', () => {
            this.physicalItemSbcs.merge(physicalItemsSbcs.map((sbc) => [sbc.fullType, sbc]))
        })
    }
    public async addCubeBlocksSbc(cubeBlocksSbc: string, mod: VENDOR_MOD): Promise<void> {
        const cubeBlocksSbcs = await parseCubeBlocksSbc(cubeBlocksSbc, mod)
        runInAction('PraisalManager.addCubeBlocksSbc', () => {
            this.cubeBlocksSbcs.merge(cubeBlocksSbcs.map((sbc) => [`${String(sbc.Id[0].TypeId[0])}/${sbc.Id[0].SubtypeId[0]}`, sbc]))
        })
    }

    @action public build(): void {
        this.buildOres()
        this.buildIngots()
        this.buildComponents()
        this.buildCubes()
    }

    @action private buildOres() {
        const ore = Ore.fromSbcs(this.physicalItemSbcs)
        this.ores.merge(ore.map((ore) => [ore.title, ore]))
    }

    @action private buildIngots() {
        const ingots = Ingot.fromSbcs(this.physicalItemSbcs, this.blueprintSbcs)
        this.ingots.merge(ingots.map((ingot) => [ingot.title, ingot]))
    }

    @action private buildComponents() {
        const components = Component.fromSbcs(this.blueprintSbcs, this.componentSbcs)
        this.components.merge(components.map((component) => [component.title, component]))
    }

    @action private buildCubes() {
        const cubes = Cube.fromSbcs(this.components, this.cubeBlocksSbcs)
        this.cubes.merge(cubes.map((component) => [component.title, component]))
    }

    @action public addGroups(groups2: typeof BLOCK_GROUPS): void {
        groups2.forEach((groupDto) => this.groups.set(groupDto.title, new Group(groupDto)))
    }

    @action public praise(blueprint: Blueprint): Praisal {
        const praisal = new Praisal(blueprint, this, this.groups)

        return praisal
    }

    public async praiseSbc(sbc: string): Promise<Praisal> {
        const blueprint = await Blueprint.parseSbc(sbc, this.cubes)

        return this.praise(blueprint)
    }
}
