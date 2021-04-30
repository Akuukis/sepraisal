import { VENDOR_MOD } from '@sepraisal/common'
import { parse } from 'fast-xml-parser'

import { IPhysicalItemDefinition } from '../xmlns/PhysicalItems'
import { PARSE_CONFIG } from './common'

export interface IParsePhysicalItemsSbc {
    displayName: string
    mass: number
    size: {X: number, Y: number, Z: number}
    subtype: string
    type: string
    volume: number
    fullType: string
    mod: VENDOR_MOD
}

export const parsePhysicalItemsSbc = async (xml: string, mod: VENDOR_MOD): Promise<IParsePhysicalItemsSbc[]> =>
    new Promise((resolve: (value: IParsePhysicalItemsSbc[]) => void, reject: (reason: Error) => void) => {
        try {
            const bp: IPhysicalItemDefinition = parse(xml, PARSE_CONFIG, true)
            const itemsDirty = bp.Definitions[0].PhysicalItems[0].PhysicalItem
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
                        fullType: `${item.Id[0].TypeId[0]}/${item.Id[0].SubtypeId[0]}`,
                        mod,
                    }))
            resolve(items)
        } catch(transformError) {
            console.error(transformError)
            reject(transformError as Error)
        }
    })
