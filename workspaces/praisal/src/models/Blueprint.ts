import { GridSize } from '@sepraisal/common'
import { parseString } from 'xml2js'

import { IBlueprintPrefabBlueprintDefinition } from '../xmlns/PrefabBlueprintDefinition'
import { IBlueprintShipDefinition } from '../xmlns/ShipBlueprintDefinition'
import { Block } from './Block'
import { Cube } from './Cube'
import { Grid } from './Grid'

const obj2mapArray = (obj: Record<string, number>) => Object.keys(obj).map<[string, number]>((key) => [key, obj[key]])

type IBlueprintShipOrPrefab = IBlueprintShipDefinition | IBlueprintPrefabBlueprintDefinition

// tslint:disable-next-line: max-line-length
const isPrefab = (def: IBlueprintShipOrPrefab): def is IBlueprintPrefabBlueprintDefinition => 'Prefabs' in def.Definitions

// tslint:disable-next-line: min-class-cohesion
export class Blueprint {

    public static async parseSbc(xml: string, cubeStore: Map<string, Cube>): Promise<Blueprint> {
            return new Promise((resolve: (value: Blueprint) => void, reject: (reason: Error) => void) => {
                parseString(xml, (parseError: Error | undefined, bp: IBlueprintShipOrPrefab) => {
                    if(parseError) reject(parseError)

                    try {
                        resolve(new Blueprint(bp, cubeStore))
                    } catch(transformError) {
                        console.info(transformError, bp)
                        reject(transformError as Error)
                    }
                })
            })
    }

    // Methods for analysis.
    public get blockcount() {
        const blockcount = this.blocks
            .map((cubeBlock) => cubeBlock.title)
            .reduce<Record<string, number>>((blockcountMap, block) => {
                    if(!(block in blockcountMap)) blockcountMap[block] = 0
                    blockcountMap[block] += 1

                    return blockcountMap
            }, {})

        return obj2mapArray(blockcount)
    }
    public get blocks() { return this.grids.reduce((blocks: Block[], grid: Grid) => blocks.concat(grid.blocks), []) }

    public get count(): number { return this.blocks.length }
    public get gridSize() {
        return this.gridSizes.reduce(
            (final, current) => final === current ? final : GridSize.MIXED,
            this.gridSizes[0] as GridSize,
        )
    }

    public get gridSizes() { return this.grids.map((grid) => grid.gridSizeEnum) }
    public get hasStaticGrid() { return this.grids.some((grid) => grid.isStatic) }

    public readonly cubeStore: Map<string, Cube>
    public displayName?: string
    public grids: Grid[]
    public ownerSteamId?: number
    public rest: object
    public title: string
    public variant: 'prefab' | 'ship'
    public workshopId?: number

    public constructor(dto: Blueprint | IBlueprintShipOrPrefab, cubeStore: Map<string, Cube>) {
        this.cubeStore = cubeStore

        if(dto instanceof Blueprint) {
            this.variant = dto.variant
            this.title = dto.title
            this.grids = dto.grids.map((grid) => new Grid(grid, cubeStore))
            this.rest = {...dto.rest}
        } else if(isPrefab(dto)) {
            this.variant = 'prefab'
            const {Id, CubeGrids, ...rest} = dto.Definitions.Prefabs[0].Prefab[0]
            this.title = Id[0].SubtypeId[0]
            this.grids = CubeGrids[0].CubeGrid
                .map((gridDto) => new Grid(gridDto, cubeStore))
            this.rest = rest
        } else {
            this.variant = 'ship'
            const blueprint = dto.Definitions.ShipBlueprints[0].ShipBlueprint[0]
            const {Id, CubeGrids, DisplayName, WorkshopId, OwnerSteamId, ...rest} = blueprint
            this.workshopId = Number(WorkshopId[0])
            this.ownerSteamId = Number(OwnerSteamId[0])
            this.displayName = DisplayName[0]
            this.title = 'TypeId' in Id[0] ? Id[0].SubtypeId[0] : Id[0].$.Subtype
            this.grids = CubeGrids[0].CubeGrid
                .map((gridDto) => new Grid(gridDto, cubeStore))
            this.rest = rest
        }

    }

    public toJSON(): IBlueprintShipDefinition | IBlueprintPrefabBlueprintDefinition {

        switch(this.variant) {
            case('prefab'): return {
                Definitions: {
                    $: {
                        'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
                        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                    },
                    Prefabs: [{
                        Prefab: [{
                            CubeGrids: [{CubeGrid: this.grids.map((grid) => grid.toJSON()) }],
                            Id: [{TypeId: ['MyObjectBuilder_PrefabDefinition'], SubtypeId: [this.title]}],
                            ...this.rest,
                        }],
                    }],
                // tslint:disable-next-line: no-any
                }} as any
            case('ship'): return {
                Definitions: {
                    $: {
                        'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
                        'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                    },
                    ShipBlueprints: [{
                        ShipBlueprint: [{
                            CubeGrids: [{CubeGrid: this.grids.map((grid) => grid.toJSON()) }],
                            DisplayName: [this.displayName],
                            Id: [{$: {Type: 'MyObjectBuilder_ShipBlueprintDefinition', Subtype: this.title}}],
                            OwnerSteamId: [String(this.ownerSteamId)],
                            WorkshopId: [String(this.workshopId)],
                            ...this.rest,
                        }],
                    }],
                },
                // tslint:disable-next-line: no-any
            } as any
            default: throw new Error(`Passthrough: ${this.variant}`)
        }

    }

}
