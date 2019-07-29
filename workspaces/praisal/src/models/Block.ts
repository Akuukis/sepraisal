import { Direction } from '@sepraisal/common'
import { Omit } from 'utility-types'

import { CubeType } from '..//xmlns/CubeType'
import { BlockDefinition, IVector } from '../xmlns/BlueprintDefinition'
import { Cube } from './Cube'

type Omits = '$' | 'SubtypeName' | 'Min' | 'BlockOrientation' | 'ColorMaskHSV'

// tslint:disable-next-line: min-class-cohesion
export class Block<T extends CubeType = CubeType> {

    public static isType<TNarrow extends CubeType>(type: TNarrow) {
        return (block: Block): block is Block<TNarrow> => block.type === type
    }

    public get gridSize()      { return this.cube ? this.cube.gridSize      : null }
    public get integrity()     { return this.cube ? this.cube.integrity     : null }
    public get mass()          { return this.cube ? this.cube.mass          : null }
    public get pcu()           { return this.cube ? this.cube.pcu           : null }
    public get prerequisites() { return this.cube ? this.cube.prerequisites : null }
    public get size()          { return this.cube ? this.cube.size          : null }
    public get subtype()       { return this.cube ? this.cube.subtype       : null }
    public get time()          { return this.cube ? this.cube.time          : null }

    public get title()         { return `${this.type}/${this.subtype}`}
    public get type(): T       { return (this.cube ? this.cube.type         : null) as T}
    public get volume()        { return this.cube ? this.cube.volume        : null }

    public readonly colorMaskHSV?: IVector
    public readonly cube?: Cube<T>
    public readonly data: Omit<BlockDefinition<T>, Omits>
    public readonly forward: Direction
    public readonly raw: BlockDefinition<T>
    public readonly up: Direction
    public readonly x: number
    public readonly y: number
    public readonly z: number

    public constructor(dto: BlockDefinition<T>, cubeStore: Map<string, Cube<T>>) {
        this.raw = dto
        const {$, SubtypeName, Min, BlockOrientation, ColorMaskHSV, ...rest} = dto
        this.cube = cubeStore.get(`${$['xsi:type'].replace('MyObjectBuilder_', '')}/${SubtypeName[0]}`)
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

    public isType<TNarrow extends T>(type: TNarrow): this is Block<TNarrow> {
        return this.type === type
    }

    public toJSON(): BlockDefinition<T> {
        return {
            $: {'xsi:type': `MyObjectBuilder_${this.type}`},
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
        // tslint:disable-next-line: no-any - TODO
        } as any
    }

}
