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

    public async addComponents(materialsXml: string, componentsXml: string) {
        const components = await Component.parseXml(materialsXml, componentsXml)
        runInAction('SEPraisal.addXmlComponent', () => {
            components.forEach((component) => this.components.set(component.title, component))
        })

    }
    public async addCubes(cubeBlocksXml: string) {
        const cubes = await Cube.parseXml(cubeBlocksXml, this.components)
        runInAction('SEPraisal.addXmlCube', () => {
            cubes.forEach((cube) => this.cubes.set(cube.title, cube))
        })

    }

    @action public addGroups(groups2: typeof BLOCK_GROUPS) {
        groups2.forEach((groupDto) => this.groups.set(groupDto.title, new Group(groupDto)))
    }
    public async addIngots(physicalItemsXml: string, materialsXml: string) {
        const ingots = await Ingot.parseXml(physicalItemsXml, materialsXml)
        runInAction('SEPraisal.addXmlIngot', () => {
            ingots.forEach((ingot) => this.ingots.set(ingot.title, ingot))
        })

    }

    public async addOres(physicalItemsXml: string) {
        const ores = await Ore.parseXml(physicalItemsXml)
        runInAction('SEPraisal.addXmlOre', () => {
            ores.forEach((ore) => this.ores.set(ore.title, ore))
        })
    }

    @action public praise(blueprint: Blueprint): Praisal {
        const praisal = new Praisal(blueprint, this, this.groups)
        this.praisals.set(blueprint.title, praisal)

        return praisal
    }

    public async praiseXml(xml: string): Promise<Praisal> {
        const blueprint = await Blueprint.parseXml(xml, this.cubes)

        return this.praise(blueprint)
    }
}
