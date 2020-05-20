import { BLOCK_GROUPS, ObservableMap } from '@sepraisal/common'
import { action, runInAction } from 'mobx'

import { Blueprint, Component, Cube, Group, Ingot, Ore } from './models'
import { Praisal } from './Praisal'

// tslint:disable-next-line: min-class-cohesion
export class PraisalManager {
    public readonly components = new ObservableMap<Component>()
    public readonly cubes = new ObservableMap<Cube>()
    public readonly groups = new ObservableMap<Group>()
    public readonly ingots = new ObservableMap<Ingot>()

    public readonly ores = new ObservableMap<Ore>()
    public readonly praisals = new ObservableMap<Praisal>()

    public async addComponents(blueprintsSbc: string, componentsSbc: string) {
        const components = await Component.parseSbc(blueprintsSbc, componentsSbc)
        runInAction('PraisalManager.addComponents', () => {
            components.forEach((component) => this.components.set(component.title, component))
        })

    }
    public async addCubes(cubeBlocksSbc: string) {
        const cubes = await Cube.parseSbc(cubeBlocksSbc, this.components)
        runInAction('PraisalManager.addCubes', () => {
            cubes.forEach((cube) => this.cubes.set(cube.title, cube))
        })

    }

    @action public addGroups(groups2: typeof BLOCK_GROUPS) {
        groups2.forEach((groupDto) => this.groups.set(groupDto.title, new Group(groupDto)))
    }
    public async addIngots(physicalItemsSbc: string, blueprintsSbc: string) {
        const ingots = await Ingot.parseSbc(physicalItemsSbc, blueprintsSbc)
        runInAction('PraisalManager.addIngots', () => {
            ingots.forEach((ingot) => this.ingots.set(ingot.title, ingot))
        })

    }

    public async addOres(physicalItemsSbc: string) {
        const ores = await Ore.parseSbc(physicalItemsSbc)
        runInAction('PraisalManager.addOres', () => {
            ores.forEach((ore) => this.ores.set(ore.title, ore))
        })
    }

    @action public praise(blueprint: Blueprint): Praisal {
        const praisal = new Praisal(blueprint, this, this.groups)
        this.praisals.set(blueprint.title, praisal)

        return praisal
    }

    public async praiseSbc(xml: string): Promise<Praisal> {
        const blueprint = await Blueprint.parseSbc(xml, this.cubes)

        return this.praise(blueprint)
    }
}
