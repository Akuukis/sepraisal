import { parseString } from 'xml2js'

import { IMaterialBlueprint, IMaterialDefinition, IMaterialItem } from '../xmlns/MaterialDefinition'

interface IParseBlueprintSbc {
    prerequisites: Record<string, number>
    subtype: string
    time: number
    type: string
}

//   <Results>
//     <Item Amount="1.4" TypeId="Ingot" SubtypeId="Stone" />
//     <Item Amount="3" TypeId="Ingot" SubtypeId="Iron" />
//     <Item Amount="0.24" TypeId="Ingot" SubtypeId="Nickel" />
//     <Item Amount="0.4" TypeId="Ingot" SubtypeId="Silicon" />
//   </Results>
//   <Results>
//     <Item Amount="1" TypeId="Ingot" SubtypeId="Stone" />
//   </Results>
//   <Result Amount="0.7" TypeId="Ingot" SubtypeId="Iron" />

export const parseBlueprintSbc = async (xml: string, filters: string[]): Promise<IParseBlueprintSbc[]> =>
    new Promise((resolve: (value: IParseBlueprintSbc[]) => void, reject: (reason: Error) => void) => {
        parseString(xml, (parseError: Error | undefined, bp: IMaterialDefinition) => {
            if(parseError) reject(parseError)
            try {
                const blockDtos = bp.Definitions.Blueprints[0].Blueprint
                    .filter((material) => !material.Results || material.Results.length === 1)  // Filter out stone.
                    .map<[IMaterialBlueprint, IMaterialItem['$']]>((material) => {
                        const resultItem = material.Result ? material.Result[0].$
                            : material.Results ? material.Results[0].Item[0].$
                            : null

                        if(resultItem === null) {
                            throw new Error(`Failed to parse material's Result(s) for ${material.DisplayName[0]}.`)
                        }

                        return [material, resultItem]
                    })
                    .filter(([, resultItem]) => filters.includes(resultItem.TypeId))
                    .map(([material, resultItem]) => ({
                            prerequisites: material.Prerequisites[0].Item.reduce((req, item) => {
                                const title = `${item.$.TypeId}/${item.$.SubtypeId}`
                                req[title] = Number(item.$.Amount) / Number(resultItem.Amount)

                                return req
                            }, Object.create(null) as Record<string, number>),
                            subtype: resultItem.SubtypeId,
                            time: Number(material.BaseProductionTimeInSeconds[0]),
                            type: resultItem.TypeId,
                        }))
                resolve(blockDtos)
            } catch(transformError) {
                console.error(transformError, bp)
                reject(transformError as Error)
            }
        })
    })

