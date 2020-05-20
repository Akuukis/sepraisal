import { parseString } from 'xml2js'

import { IPhysicalItemDefinition } from '../xmlns/PhysicalItems'

export interface IParsePhysicalItemsSbc {
    displayName: string
    mass: number
    size: {X: number, Y: number, Z: number}
    subtype: string
    type: string
    volume: number
    fullType: string
}

export const parsePhysicalItemsSbc = async (xml: string): Promise<IParsePhysicalItemsSbc[]> =>
    new Promise((resolve: (value: IParsePhysicalItemsSbc[]) => void, reject: (reason: Error) => void) => {
        parseString(xml, (parseError: Error | undefined, bp: IPhysicalItemDefinition) => {
            if(parseError) reject(parseError)
            try {
                const itemsDirty = bp.Definitions.PhysicalItems[0].PhysicalItem
                const items = itemsDirty
                    .map((item) => ({
                            displayName: item.DisplayName[0],
                            mass: Number(item.Mass[0]),
                            size: {
                                X: Number(item.Size[0].X[0]),
                                Y: Number(item.Size[0].Y[0]),
                                Z: Number(item.Size[0].Z[0]),
                            },
                            subtype: item.Id[0].SubtypeId[0],
                            type: item.Id[0].TypeId[0],
                            volume: Number(item.Volume[0]),
                            fullType: `${item.Id[0].TypeId[0]}/${item.Id[0].SubtypeId[0]}`
                        }))
                resolve(items)
            } catch(transformError) {
                console.error(transformError, bp)
                reject(transformError as Error)
            }
        })
    })
