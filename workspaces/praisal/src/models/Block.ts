import { Direction } from '@sepraisal/common/index.ts'
import { Omit } from 'utility-types'

import { CubeType } from '../xmlns/CubeType.ts'
import { BlockDefinition, IVector } from '../xmlns/BlueprintDefinition.ts'
import { Cube } from './Cube.ts'

type Omits = '$' | 'SubtypeName' | 'Min' | 'BlockOrientation' | 'ColorMaskHSV'

export class Block<T extends CubeType = CubeType> {

    public static isType<TNarrow extends CubeType>(testType: TNarrow) {
        return (block: Block): block is Block<TNarrow> => block.type === testType as CubeType
    }

    public readonly colorMaskHSV?: IVector
    public readonly cube: Cube<T> | null
    public readonly data: Omit<BlockDefinition<T>, Omits>
    public readonly forward: Direction
    public readonly gridSize: Cube['gridSize'] | null
    public readonly integrity: Cube['integrity'] | null
    public readonly mass: Cube['mass'] | null
    public readonly pcu: Cube['pcu'] | null
    public readonly prerequisites: Cube['prerequisites'] | null
    public readonly raw: BlockDefinition<T>
    public readonly size: Cube['size'] | null
    public readonly subtype: Cube['subtype'] | null
    public readonly time: Cube['time'] | null
    public readonly title: string
    public readonly type: T | null
    public readonly up: Direction
    public readonly volume: Cube['volume'] | null
    public readonly x: number
    public readonly y: number
    public readonly z: number

    public constructor(dto: Block<T> | BlockDefinition<T>, cubeStore: Map<string, Cube<T>>) {
        if(dto instanceof Block) {
            this.raw = dto.raw

            this.type = dto.type
            this.subtype = dto.subtype
            this.title = dto.title
            this.cube = dto.cube

            this.x = dto.x
            this.y = dto.y
            this.z = dto.z
            this.forward = dto.forward
            this.up = dto.up
            this.colorMaskHSV = dto.colorMaskHSV
            this.data = dto.data
        } else {
            this.raw = dto
            const {$, SubtypeName, Min, BlockOrientation, ColorMaskHSV, ...rest} = dto

            this.type = $['xsi:type'].replace('MyObjectBuilder_', '') as T
            this.subtype = SubtypeName[0] ?? null
            this.title = `${String(this.type)}/${String(this.subtype)}`
            this.cube = cubeStore.get(this.title) || null

            this.x = Number(Min !== undefined ? Min[0].$.x : 0)
            this.y = Number(Min !== undefined ? Min[0].$.y : 0)
            this.z = Number(Min !== undefined ? Min[0].$.z : 0)
            this.forward = BlockOrientation ? BlockOrientation[0].$.Forward : Direction.Forward
            this.up = BlockOrientation ? BlockOrientation[0].$.Up : Direction.Up
            this.colorMaskHSV = !ColorMaskHSV ? undefined : {
                x: ColorMaskHSV[0].$.x,
                y: ColorMaskHSV[0].$.y,
                z: ColorMaskHSV[0].$.z,
            }
            this.data = rest as this['data']
        }

        this.gridSize       = this.cube ? this.cube.gridSize      : null
        this.integrity      = this.cube ? this.cube.integrity     : null
        this.mass           = this.cube ? this.cube.mass          : null
        this.pcu            = this.cube ? this.cube.pcu           : null
        this.prerequisites  = this.cube ? this.cube.prerequisites : null
        this.size           = this.cube ? this.cube.size          : null
        this.time           = this.cube ? this.cube.time          : null
        this.volume         = this.cube ? this.cube.volume        : null
    }

    public isType<TNarrow extends T>(type: TNarrow): this is Block<TNarrow> {
        return this.type === type
    }

    public toJSON(): BlockDefinition<T> {
        return {
            $: {'xsi:type': `MyObjectBuilder_${String(this.type)}`},
            BlockOrientation: [{$: {
                Forward: this.forward,
                Up: this.up,
            }}],
            Min: [{$: {
                x: String(this.x),
                y: String(this.y),
                z: String(this.z),
            }}],
            SubtypeName: [this.subtype],
            ...this.data,
        } as never
    }

}
