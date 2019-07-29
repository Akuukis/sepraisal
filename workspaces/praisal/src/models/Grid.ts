import { parseString } from 'xml2js'

import { IBlueprintBlockGroup, IBlueprintCubeGrid } from '../xmlns/BlueprintDefinition'
import { Block } from './Block'
import { Cube } from './Cube'

const obj2mapArray = (obj: Record<string, number>) => Object.keys(obj).map<[string, number]>((key) => [key, obj[key]])

export type GridSize = 'Large' | 'Small' | 'Mixed'

// tslint:disable-next-line: min-class-cohesion
export class Grid {

    public static async parseXml(xml: string, cubeStore: Map<string, Cube>): Promise<Grid> {
            return new Promise((resolve: (value: Grid) => void, reject: (reason: Error) => void) => {
                    parseString(xml, (parseError: Error | undefined, bp: IBlueprintCubeGrid) => {
                        if(parseError) reject(parseError)
                        try {
                                resolve(new Grid(bp, cubeStore))
                        } catch(transformError) {
                                console.error(transformError, bp)
                                reject(transformError as Error)
                        }
                    })
            })
    }


    // Methods for analysis.
    public get blockcount() {
        const blockcount = this.blocks
            .map((cubeBlock) => cubeBlock.title)
            .reduce((blockcountMap, block) => {
                    if(!(block in blockcountMap)) blockcountMap[block] = 0
                    blockcountMap[block] += 1

                    return blockcountMap
            }, Object.create(null) as Record<string, number>)

        return obj2mapArray(blockcount)
    }

    public get count(): number { return this.blocks.length }
    public readonly blockGroups: IBlueprintBlockGroup[]
    public blocks: Block[]
    public readonly conveyorLines: unknown
    public readonly destructibleBlocks: boolean
    public readonly displayName: string
    public readonly entityId: number
    public readonly gridSizeEnum: 'Large' | 'Small'
    public readonly isRespawnGrid: boolean
    public readonly isStatic: boolean
    public readonly oxygenAmount: unknown
    public readonly persistentFlags: string[]
    public readonly rest: unknown
    private readonly cubeStore: Map<string, Cube>

    public constructor(dto: IBlueprintCubeGrid, cubeStore: Map<string, Cube>) {
        this.cubeStore = cubeStore
        const {
                IsStatic,
                CubeBlocks,
                EntityId,
                PersistentFlags,
                GridSizeEnum,
                ConveyorLines,
                BlockGroups,
                DisplayName,
                OxygenAmount,
                DestructibleBlocks,
                IsRespawnGrid,
                ...rest
            } = dto

        this.blocks = CubeBlocks[0].MyObjectBuilder_CubeBlock
            .map((blockDto) => new Block(blockDto, this.cubeStore))

        this.blockGroups = BlockGroups !== undefined ? BlockGroups[0].MyObjectBuilder_BlockGroup : []
        this.conveyorLines = ConveyorLines
        this.destructibleBlocks = DestructibleBlocks ? DestructibleBlocks[0] === 'true' : false
        this.displayName = DisplayName[0]
        this.entityId = Number(EntityId[0])
        this.gridSizeEnum = GridSizeEnum[0]
        this.isRespawnGrid = IsRespawnGrid ? IsRespawnGrid[0] === 'true' : false
        this.isStatic = IsStatic ? IsStatic[0] === 'true' : false
        this.oxygenAmount = OxygenAmount
        this.persistentFlags = PersistentFlags[0].split(' ')
        this.rest = rest
    }

    public toJSON(): IBlueprintCubeGrid {
        // tslint:disable-next-line: no-object-literal-type-assertion
        return {
            BlockGroups: [{MyObjectBuilder_BlockGroup: this.blockGroups}],
            CubeBlocks: [{
                MyObjectBuilder_CubeBlock: this.blocks.map((block) => block.toJSON()),
            }],
            DestructibleBlocks: [String(this.destructibleBlocks)],
            DisplayName: [this.displayName],
            EntityId: [String(this.entityId)],
            GridSizeEnum: [this.gridSizeEnum],
            IsRespawnGrid: [String(this.isRespawnGrid)],
            PersistentFlags: [this.persistentFlags.join(' ')],
            ...(this.isStatic ? {IsStatic: ['true']} : {}),

            ConveyorLines: this.conveyorLines,
            OxygenAmount: this.oxygenAmount,
            ...this.rest,
        } as IBlueprintCubeGrid
    }

}
