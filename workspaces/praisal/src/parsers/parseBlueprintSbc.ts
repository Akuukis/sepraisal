import { VENDOR_MOD } from '@sepraisal/common/src'
import { parseString } from 'xml2js'

import { IMaterialBlueprint, IMaterialDefinition, IMaterialItem } from '../xmlns/MaterialDefinition'

export interface IParseBlueprintSbc {
    prerequisites: Record<string, number>
    subtype: string
    time: number
    type: string
    fullType: string
    mod: VENDOR_MOD
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

export const parseBlueprintSbc = async (xml: string, mod: VENDOR_MOD): Promise<IParseBlueprintSbc[]> =>
    new Promise((resolve: (value: IParseBlueprintSbc[]) => void, reject: (reason: Error) => void) => {
        parseString(xml, (parseError: Error | undefined, bp: IMaterialDefinition) => {
            if(parseError) reject(parseError)
            try {
                const blockDtos = bp.Definitions.Blueprints[0].Blueprint
                    .filter((material) => !material.Results || material.Results.length === 1)  // Skip stone.
                    .map<[IMaterialBlueprint, IMaterialItem['$']]>((material) => {
                        const resultItem = material.Result ? material.Result[0].$
                            : material.Results ? material.Results[0].Item[0].$
                            : null

                        if(resultItem === null) {
                            throw new Error(`Failed to parse material's Result(s) for ${material.DisplayName[0]}.`)
                        }

                        return [material, resultItem]
                    })
                    .map(([material, resultItem]) => ({
                            prerequisites: material.Prerequisites[0].Item.reduce((req, item) => {
                                const title = `${item.$.TypeId}/${item.$.SubtypeId}`
                                req[title] = Number(item.$.Amount) / Number(resultItem.Amount)

                                return req
                            }, Object.create(null) as Record<string, number>),
                            subtype: resultItem.SubtypeId,
                            time: Number(material.BaseProductionTimeInSeconds[0]),
                            type: resultItem.TypeId,
                            fullType: `${resultItem.TypeId}/${resultItem.SubtypeId}`,
                            mod,
                        }))
                    .filter((blueprintSbc) => {
                        if(blueprintSbc.type !== 'Ingot') return true

                        const reqs = Object.keys(blueprintSbc.prerequisites)
                        if(reqs.length > 1) return false
                        if(!reqs[0].includes('Ore')) return false
                        if(reqs[0] === 'Ore/Ice') return false
                        if(reqs[0] === 'Ore/Scrap') return false

                        return true
                    })
                resolve(blockDtos)
            } catch(transformError) {
                console.error(transformError, bp)
                reject(transformError as Error)
            }
        })
    })
