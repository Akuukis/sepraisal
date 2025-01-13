import { GridSize } from '@sepraisal/common/src'
import { parse } from 'fast-xml-parser'
import { PARSE_CONFIG } from '../parsers/common'

import { CubeType } from '../xmlns/CubeType'
import { IBlueprintPrefabBlueprintDefinition } from '../xmlns/PrefabBlueprintDefinition'
import { IBlueprintShipDefinition } from '../xmlns/ShipBlueprintDefinition'
import { Block } from './Block'
import { Cube } from './Cube'
import { Grid } from './Grid'

const obj2mapArray = (obj: Record<string, number>) => Object.keys(obj).map<[string, number]>((key) => [key, obj[key]])

type IBlueprintShipOrPrefab = IBlueprintShipDefinition | IBlueprintPrefabBlueprintDefinition

const isPrefab = (def: IBlueprintShipOrPrefab): def is IBlueprintPrefabBlueprintDefinition => 'Prefabs' in def.Definitions[0]

export class Blueprint {
    public static async parseSbc(xml: string, cubeStore: Map<string, Cube>): Promise<Blueprint> {
        const originalSize = xml.length
        return new Promise((resolve: (value: Blueprint) => void, reject: (reason: Error) => void) => {
            try {
                process.stdout.write('Parsing XML...\n')
                const bp: IBlueprintShipOrPrefab = parse(xml, PARSE_CONFIG, true)
                process.stdout.write('XML parsed successfully.\n')
                resolve(new Blueprint(bp, originalSize, cubeStore))
            } catch(transformError) {
                process.stdout.write(`Error parsing XML: ${transformError}\n`)
                reject(transformError as Error)
            }
        })
    }

    // Methods for analysis.
    public get blockcount(): [string, number][] {
        const blockcount = this.blocks
            .map((cubeBlock) => cubeBlock.title)
            .reduce<Record<string, number>>((blockcountMap, block) => {
                if(!(block in blockcountMap)) blockcountMap[block] = 0
                blockcountMap[block] += 1

                return blockcountMap
            }, {})

        return obj2mapArray(blockcount)
    }
    public get blocks(): Block<CubeType>[] { return this.grids.reduce((blocks: Block[], grid: Grid) => blocks.concat(grid.blocks), []) }

    public get count(): number { return this.blocks.length }
    public get gridSize(): GridSize {
        return this.gridSizes.reduce(
            (final, current) => final === current ? final : GridSize.MIXED,
            this.gridSizes[0] as GridSize,
        )
    }

    public get gridSizes(): ("Large" | "Small")[] { return this.grids.map((grid) => grid.gridSizeEnum) }
    public get hasStaticGrid(): boolean { return this.grids.some((grid) => grid.isStatic) }

    public readonly cubeStore: Map<string, Cube>
    public displayName?: string
    public grids: Grid[]
    public ownerSteamId?: number
    public rest: Record<string, unknown>
    public title: string
    public variant: 'prefab' | 'ship'
    public workshopId?: number
    public originalSize: number

    public constructor(dto: Blueprint)
    public constructor(dto: IBlueprintShipOrPrefab, originalSize: number, cubeStore: Map<string, Cube>)
    public constructor(dto: Blueprint | IBlueprintShipOrPrefab, originalSize?: number, cubeStore?: Map<string, Cube>) {
        if(dto instanceof Blueprint) {
            this.originalSize = dto.originalSize
            this.cubeStore = dto.cubeStore
            this.variant = dto.variant
            this.title = dto.title
            this.grids = dto.grids.map((grid) => new Grid(grid, this.cubeStore))
            this.rest = {...dto.rest}
        } else if(isPrefab(dto)) {
            this.originalSize = originalSize!
            this.cubeStore = cubeStore!
            this.variant = 'prefab'
            const {Id, CubeGrids, ...rest} = dto.Definitions[0].Prefabs[0].Prefab[0]
            this.title = Id[0].SubtypeId[0]
            this.grids = CubeGrids[0].CubeGrid
                .map((gridDto) => new Grid(gridDto, this.cubeStore))
            this.rest = rest as Record<string, any>
        } else {
            this.originalSize = originalSize!
            this.cubeStore = cubeStore!
            this.variant = 'ship'
            const blueprint = dto.Definitions[0].ShipBlueprints[0].ShipBlueprint[0]
            const {Id, CubeGrids, DisplayName, WorkshopId, OwnerSteamId, ...rest} = blueprint
            this.workshopId = Number(WorkshopId[0])
            this.ownerSteamId = Number(OwnerSteamId[0])
            this.displayName = DisplayName[0]
            this.title = 'TypeId' in Id[0] ? Id[0].SubtypeId[0] : Id[0].$.Subtype
            this.grids = CubeGrids[0].CubeGrid
                .map((gridDto) => new Grid(gridDto, this.cubeStore))
            this.rest = rest as Record<string, any>
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
                }} as never
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
            } as never
            default: throw new Error(`Passthrough: ${this.variant}`)
        }
    }
}