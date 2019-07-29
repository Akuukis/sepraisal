import { parseString } from 'xml2js'

import { IMaterialDefinition } from '../xmlns/MaterialDefinition'

interface IParseBlueprintSbc {
    prerequisites: Record<string, number>
    subtype: string
    time: number
    type: string
}

export const parseBlueprintSbc = async (xml: string, filter: string): Promise<IParseBlueprintSbc[]> =>
    new Promise((resolve: (value: IParseBlueprintSbc[]) => void, reject: (reason: Error) => void) => {
        parseString(xml, (parseError: Error | undefined, bp: IMaterialDefinition) => {
            if(parseError) reject(parseError)
            try {
                const blockDtos = bp.Definitions.Blueprints[0].Blueprint
                    .filter((material) => material.Result[0].$.TypeId === filter)
                    .map((material) => ({
                            prerequisites: material.Prerequisites[0].Item.reduce((req, item) => {
                                const title = `${item.$.TypeId}/${item.$.SubtypeId}`
                                req[title] = Number(item.$.Amount) / Number(material.Result[0].$.Amount)

                                return req
                            }, Object.create(null) as Record<string, number>),
                            subtype: material.Result[0].$.SubtypeId,
                            time: Number(material.BaseProductionTimeInSeconds[0]),
                            type: material.Result[0].$.TypeId,
                        }))
                resolve(blockDtos)
            } catch(transformError) {
                console.error(transformError, bp)
                reject(transformError as Error)
            }
        })
    })

