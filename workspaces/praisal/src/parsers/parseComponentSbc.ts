import { VENDOR_MOD } from '@sepraisal/common'
import { parse } from 'fast-xml-parser'

import { IComponentDefinition } from '../xmlns/ComponentDefinition.ts'
import { PARSE_CONFIG } from './common.ts'

export interface IParseComponentSbc {
    displayName: string
    health: number
    mass: number
    maxIntegrity: number
    size: {X: number, Y: number, Z: number}
    subtype: string
    type: string
    volume: number
    fullType: string
    mod: VENDOR_MOD
}

export const parseComponentSbc = async (xml: string, mod: VENDOR_MOD): Promise<IParseComponentSbc[]> =>
    new Promise((resolve: (value: IParseComponentSbc[]) => void, reject: (reason: Error) => void) => {
        try {
            const bp: IComponentDefinition = parse(xml, PARSE_CONFIG, true)
            const componentsDirty = bp.Definitions[0].Components[0].Component
            const components = componentsDirty
                .map((comp) => ({
                        displayName: comp.DisplayName[0],
                        health: Number('Health' in comp ? comp.Health[0] : 0),
                        mass: Number(comp.Mass[0]),
                        maxIntegrity: Number(comp.MaxIntegrity[0]),
                        size: {
                            X: Number(comp.Size[0].X[0]),
                            Y: Number(comp.Size[0].Y[0]),
                            Z: Number(comp.Size[0].Z[0]),
                        },
                        subtype: comp.Id[0].SubtypeId[0],
                        type: comp.Id[0].TypeId[0],
                        volume: Number(comp.Volume[0]),
                        fullType: `${comp.Id[0].TypeId[0]}/${comp.Id[0].SubtypeId[0]}`,
                        mod,
                    }))
            resolve(components)
        } catch(err) {
            console.error(err)
            reject(err as Error)
        }
    })
