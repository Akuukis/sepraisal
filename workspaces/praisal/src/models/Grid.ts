import { parse } from 'fast-xml-parser'
import { PARSE_CONFIG } from '../parsers/common'

import { IBlueprintBlockGroup, IBlueprintCubeGrid } from '../xmlns/BlueprintDefinition'
import { Block } from './Block'
import { Cube } from './Cube'

const obj2mapArray = (obj: Record<string, number>) => Object.keys(obj).map<[string, number]>((key) => [key, obj[key]])

export type GridSize = 'Large' | 'Small' | 'Mixed'

export class Grid {

    public static async parseSbc(xml: string, cubeStore: Map<string, Cube>): Promise<Grid> {
        return new Promise((resolve: (value: Grid) => void, reject: (reason: Error) => void) => {
            try {
                const bp: IBlueprintCubeGrid = parse(xml, PARSE_CONFIG, true)
                resolve(new Grid(bp, cubeStore))
            } catch(transformError) {
                console.error(transformError)
                reject(transformError as Error)
            }
        })
    }


    // Methods for analysis.
    public get blockcount(): [string, number][] {
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
    public readonly rest: Record<string, unknown>
    private readonly cubeStore: Map<string, Cube>

    public constructor(dto: Grid | IBlueprintCubeGrid, cubeStore: Map<string, Cube>) {
        this.cubeStore = cubeStore

        if(dto instanceof Grid) {
            this.blocks = dto.blocks.map((block) => new Block(block, cubeStore))
            this.blockGroups = dto.blockGroups
            this.conveyorLines = dto.conveyorLines
            this.destructibleBlocks = dto.destructibleBlocks
            this.displayName = dto.displayName
            this.entityId = dto.entityId
            this.gridSizeEnum = dto.gridSizeEnum
            this.isRespawnGrid = dto.isRespawnGrid
            this.isStatic = dto.isStatic
            this.oxygenAmount = dto.oxygenAmount
            this.persistentFlags = dto.persistentFlags
            this.rest = dto.rest
        } else {
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
            this.rest = rest as Record<string, any>  /* eslint-disable-line @typescript-eslint/no-explicit-any */  // TODO: better typing
        }
    }

    public toJSON(): IBlueprintCubeGrid {
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
        } as unknown as IBlueprintCubeGrid
    }

}
