import { VENDOR_MOD } from '@sepraisal/common/src'
import { parseString } from 'xml2js'

import { IComponentDefinition } from '..//xmlns/ComponentDefinition'

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
        parseString(xml, (parseError: Error | undefined, bp: IComponentDefinition) => {
            if(parseError) reject(parseError)
            try {
                const componentsDirty = bp.Definitions.Components[0].Component
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
            } catch(transformError) {
                console.error(transformError, bp)
                reject(transformError as Error)
            }
        })
    })
