import { Omit } from 'utility-types'
import { parseString } from 'xml2js'

import { CubeDTO, ICubeDefinition } from '..//xmlns/CubeDefinition'
import { CubeType } from '..//xmlns/CubeType'
import { Component } from './Component'


export type CubeBlockGridSize = 'Large' | 'Small'


type Omits = 'BuildTimeSeconds' | 'CubeSize' | 'DisplayName' | 'Id' | 'PCU' | 'Size'

// tslint:disable-next-line: min-class-cohesion
export class Cube<T extends CubeType = CubeType> implements Omit<Component, 'toJSON' | 'health' | 'maxIntegrity'> {

    public static async parseXml(xml: string, componentStore: Map<string, Component>): Promise<Cube[]> {
        return new Promise((resolve: (value: Cube[]) => void, reject: (reason: Error) => void) => {
            parseString(xml, (parseError, bp: ICubeDefinition) => {
                try {
                    resolve(bp.Definitions.CubeBlocks[0].Definition
                        .filter((cubeDto) => cubeDto.Id['0'].SubtypeId['0'] !== 'DeadAstronaut')
                        .map((cubeDto) => new Cube(cubeDto, componentStore)))
                } catch(err) {
                    reject(err as Error)
                }
            })
        })
    }


    public get title() { return `${String(this.type)}/${this.subtype}`}
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

    public constructor(cubeDto: CubeDTO<T>, componentStore: Map<string, Component>) {
        const {BuildTimeSeconds, CubeSize, DisplayName, Id, PCU, Size, ...other} = cubeDto
        this.data = other as this['data']

        const prerequisites = other.Components[0].Component.reduce((req, comp) => {
                const title = `Component/${comp.$.Subtype}`
                req[title] = Number(comp.$.Count) + (title in req ? Number(req[title]) : 0)

                return req
            }, Object.create(null) as Record<string, number>)

        const time = Number(!Array.isArray(BuildTimeSeconds) ? 0 : BuildTimeSeconds[0])  // Default = 0
        const pcu = Number(!Array.isArray(PCU) ? 0 : PCU[0])  // Default = 0

        this.type = Id[0].TypeId[0] as T
        this.subtype = Id[0].SubtypeId[0]
        this.displayName = DisplayName[0]
        this.gridSize = CubeSize[0]
        this.time = time
        this.prerequisites = prerequisites
        this.pcu = pcu
        this.size = {
                X: Number(Size[0].$.x),
                Y: Number(Size[0].$.y),
                Z: Number(Size[0].$.z),
            }

        this.mass = Object.keys(this.prerequisites).reduce((sum, typeSubtype) => {
            const component = componentStore.get(typeSubtype)

            return sum + (component ? component.mass * this.prerequisites[typeSubtype] : 0)
        }, 0)

        this.integrity = Object.keys(this.prerequisites).reduce((sum, typeSubtype) => {
            const component = componentStore.get(typeSubtype)

            return sum + (component ? component.maxIntegrity * this.prerequisites[typeSubtype] : 0)
        }, 0)

        const mod = this.gridSize === 'Large' ? 2.5 : 0.5
        this.volume = (mod * this.size.X) * (mod * this.size.Y) * (mod * this.size.Z) * 1000  // volume is in liters.
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
        // tslint:disable-next-line: no-any
        } as any
    }

}
