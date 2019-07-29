import { IBlueprintCubeGrids } from './BlueprintDefinition'
import { IXml2js } from './xml2js'

export interface IBlueprintPrefabId extends IXml2js {
  readonly SubtypeId: readonly [string],
  readonly TypeId: readonly ['MyObjectBuilder_PrefabDefinition'],
}

export interface IBlueprintPrefab extends IXml2js {
  readonly CubeGrids: readonly [IBlueprintCubeGrids],
  readonly Id: readonly [IBlueprintPrefabId],
//   readonly DisplayName: readonly [string],
//   readonly WorkshopId: readonly [string],
//   readonly OwnerSteamId: readonly [string],
//   readonly Points: readonly [number],
}

export interface IBlueprintPrefabs extends IXml2js {
  readonly Prefab: readonly [IBlueprintPrefab],
}

export interface IBlueprintPrefabDefinitions extends IXml2js {
  readonly $: {
    readonly 'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
    readonly 'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
  },
  readonly Prefabs: readonly [IBlueprintPrefabs],
}

// tslint:disable-next-line: id-length
export interface IBlueprintPrefabBlueprintDefinition {
  readonly Definitions: IBlueprintPrefabDefinitions,
}
