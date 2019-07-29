import { IBlueprintCubeGrids } from './BlueprintDefinition'
import { IXml2js } from './xml2js'

export interface IBlueprintShipIdAttr extends IXml2js {
  readonly $: {
    readonly Subtype: string,
    readonly Type: 'MyObjectBuilder_ShipBlueprintDefinition',
  }
}

export interface IBlueprintShipIdChild extends IXml2js {
  readonly SubtypeId: readonly [string],
  readonly TypeId: readonly ['MyObjectBuilder_ShipBlueprintDefinition'],
}

export interface IBlueprintShipBlueprint extends IXml2js {
  readonly CubeGrids: readonly [IBlueprintCubeGrids],
  readonly DisplayName: readonly [string],
  readonly Id: readonly [IBlueprintShipIdAttr | IBlueprintShipIdChild],
  readonly OwnerSteamId: readonly [string],
  readonly Points: readonly [number],
  readonly WorkshopId: readonly [string],
}

export interface IBlueprintShipBlueprints extends IXml2js {
  readonly ShipBlueprint: readonly [IBlueprintShipBlueprint],
}

export interface IBlueprintShipDefinitions extends IXml2js {
  readonly $: {
    readonly 'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
    readonly 'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
  },
  readonly ShipBlueprints: readonly [IBlueprintShipBlueprints],
}

export interface IBlueprintShipDefinition {
  readonly Definitions: IBlueprintShipDefinitions,
}
