import { GridSize } from '@sepraisal/common'
import { parse } from 'fast-xml-parser'
import { BlockDefinition, IBlueprintCubeGrid } from '..//xmlns/BlueprintDefinition'
import { IBlueprintPrefabBlueprintDefinition, IBlueprintPrefabDefinitions } from '..//xmlns/PrefabBlueprintDefinition'
import { IBlueprintShipDefinition, IBlueprintShipDefinitions } from '..//xmlns/ShipBlueprintDefinition'
import { PARSE_CONFIG } from './common'

export interface IBlueprintDTO {
    blocks: BlockDefinition[],
    gridCount: number,
    gridSize: GridSize,
    hasStaticGrid: boolean,
    title: string,
}


// Static methods for parsing input before construction.
const isPrefab = (def: IBlueprintPrefabDefinitions | IBlueprintShipDefinitions): def is IBlueprintPrefabDefinitions =>
    'Prefabs' in def

const parseBlueprint = (title: string, cubeGrids: IBlueprintCubeGrid[]): IBlueprintDTO => {
    const gridSizes = cubeGrids.map((cubeGrid) => cubeGrid.GridSizeEnum[0])
    const gridCount = gridSizes.length
    const gridSize = gridSizes
        .reduce((final, current) => final === current ? final : GridSize.MIXED, gridSizes[0] as GridSize)
    const blocks = cubeGrids
        .reduce((oneCubeGrid: BlockDefinition[], cubeGrid: IBlueprintCubeGrid) =>
            oneCubeGrid.concat(cubeGrid.CubeBlocks[0].MyObjectBuilder_CubeBlock), [])

    const hasStaticGrid = cubeGrids
        .some((grid) => 'IsStatic' in grid && !!grid.IsStatic ? grid.IsStatic[0] === 'true' : false)

    return {
        blocks,
        gridCount,
        gridSize,
        hasStaticGrid,
        title,
    }
}

const parsePrefabBlueprint = (def: IBlueprintPrefabDefinitions) => {
    const blueprint = def.Prefabs[0].Prefab[0]

    return parseBlueprint(blueprint.Id[0].SubtypeId[0], blueprint.CubeGrids[0].CubeGrid)
}

const parseShipBlueprint = (def: IBlueprintShipDefinitions) => {
    const blueprint = def.ShipBlueprints[0].ShipBlueprint[0]
    const idField = blueprint.Id[0]
    const subtype = 'TypeId' in idField ? idField.SubtypeId[0] : idField.$.Subtype

    return parseBlueprint(subtype, blueprint.CubeGrids[0].CubeGrid)
}

export const parseBlueprintXml = async (xml: string): Promise<IBlueprintDTO> =>
    new Promise((resolve: (value: IBlueprintDTO) => void, reject: (reason: Error) => void) => {
        try {
            const bp: IBlueprintShipDefinition | IBlueprintPrefabBlueprintDefinition = parse(xml, PARSE_CONFIG, true)

            console.log(bp)
            const def = bp.Definitions[0]
            try {
                resolve(isPrefab(def) ? parsePrefabBlueprint(def) : parseShipBlueprint(def))
            } catch(transformError) {
                console.error(transformError, bp)
                reject(transformError as Error)
            }
        } catch(err) {
            console.log(err)
            reject(err)
        }
    })
