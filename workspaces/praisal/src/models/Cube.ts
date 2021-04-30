import { VENDOR_MOD } from '@sepraisal/common/index.ts'
import { Omit } from 'utility-types'

import { IParseCubeBlocksSbc } from '../parsers/parseCubeBlocksSbc.ts'
import { CubeDTO } from '../xmlns/CubeDefinition.ts'
import { CubeType } from '../xmlns/CubeType.ts'
import { Component } from './Component.ts'


export type CubeBlockGridSize = 'Large' | 'Small'


type Omits = 'BuildTimeSeconds' | 'CubeSize' | 'DisplayName' | 'Id' | 'PCU' | 'Size'

export class Cube<T extends CubeType = CubeType> implements Omit<Component, 'toJSON' | 'health' | 'maxIntegrity'> {

    public static fromSbcs(componentStore: Map<string, Component>, cubeBlocksSbcs: Map<string, IParseCubeBlocksSbc>): Cube[] {
        return [...cubeBlocksSbcs.values()].map((cubeDto) => new Cube(cubeDto, componentStore, cubeDto.mod))
    }

    public get title(): string { return `${String(this.type)}/${this.subtype}`}
    public readonly data: Omit<CubeDTO<T>, Omits>
    public readonly displayName: string
    public readonly gridSize: CubeBlockGridSize
    public readonly integrity: number
    public readonly mass: number
    public readonly pcu: number
    public readonly prerequisites: Record<string, number>
    public readonly size: {X: number, Y: number, Z: number}
    public readonly subtype: string
    public readonly time: number  // Seconds to build, baseBuildTime.
    public readonly type: T
    public readonly volume: number
    public readonly mod: VENDOR_MOD

    public constructor(cubeDto: CubeDTO<T>, componentStore: Map<string, Component>, mod: VENDOR_MOD) {
        const {BuildTimeSeconds, CubeSize, DisplayName, Id, PCU, Size, ...other} = cubeDto
        this.data = other as this['data']
        this.mod = mod

        const prerequisites = other.Components[0].Component.reduce((req, comp) => {
                const title = `Component/${comp.$.Subtype}`
                req[title] = Number(comp.$.Count) + (title in req ? Number(req[title]) : 0)

                return req
            }, Object.create(null) as Record<string, number>)

        const time = Number(!Array.isArray(BuildTimeSeconds) ? 0 : BuildTimeSeconds[0])  // Default = 0
        const pcu = Number(!Array.isArray(PCU) ? 0 : PCU[0])  // Default = 0

        this.type = Id[0].TypeId[0].replace('MyObjectBuilder_', '') as T
        this.subtype = Id[0].SubtypeId[0]
        this.displayName = DisplayName[0]
        this.gridSize = CubeSize[0]
        this.time = time
        this.prerequisites = prerequisites
        this.pcu = pcu
        const sizeSomething = Size[0]
        if('$' in sizeSomething) {
            this.size = {
                X: Number(sizeSomething.$.x),
                Y: Number(sizeSomething.$.y),
                Z: Number(sizeSomething.$.z),
            }
        } else {
            this.size = {
                X: Number(sizeSomething.X[0]),
                Y: Number(sizeSomething.Y[0]),
                Z: Number(sizeSomething.Z[0]),
            }
        }


        this.mass = Object.entries(this.prerequisites).reduce<number>((sum, [typeSubtype, amount]) => {
            const component = componentStore.get(typeSubtype)

            return sum + (component ? component.mass * amount : 0)
        }, 0)

        this.integrity = Object.entries(this.prerequisites).reduce<number>((sum, [typeSubtype, amount]) => {
            const component = componentStore.get(typeSubtype)

            return sum + (component ? component.maxIntegrity * amount : 0)
        }, 0)

        const blockSize = this.gridSize === 'Large' ? 2.5 : 0.5
        this.volume = (blockSize * this.size.X) * (blockSize * this.size.Y) * (blockSize * this.size.Z) * 1000  // volume is in liters.
    }

    public toJSON(): CubeDTO<T> {
        return {
            BuildTimeSeconds: [this.time],
            CubeSize: [this.gridSize],
            DisplayName: [this.displayName],
            Id: [{
                SubtypeId: [this.subtype],
                TypeId: [`MyObjectBuilder_${String(this.type)}`],
            }],
            PCU: [this.pcu],
            Size: [{
                $: {
                    x: this.size.X,
                    y: this.size.Y,
                    z: this.size.Z,
                },
            }],

            ...this.data,
        } as never
    }

}
