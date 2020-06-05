import { IXml2js } from './xml2js'

export interface IMaterialId extends IXml2js {
    readonly SubtypeId: readonly [string],
    readonly TypeId: readonly ['BlueprintDefinition'],
}

export interface IMaterialItem extends IXml2js {
    readonly $: {
        readonly Amount: string,
        readonly SubtypeId: string,
        readonly TypeId: string,
    },
}

export interface IMaterialPrerequisites extends IXml2js {
    readonly Item: readonly [IMaterialItem],
}

export interface IMaterialBlueprint extends IXml2js {
    readonly BaseProductionTimeInSeconds: readonly [number],
    readonly DisplayName: readonly [string],
    readonly Id: readonly [IMaterialId],
    readonly Prerequisites: readonly [IMaterialPrerequisites],
    readonly Result?: readonly [IMaterialItem],
    readonly Results?: readonly [IMaterialPrerequisites],
    // ...
}

export interface IMaterialBlueprints extends IXml2js {
    readonly Blueprint: readonly [IMaterialBlueprint],
}

export interface IMaterialDefinitions extends IXml2js {
    readonly $: {
        readonly 'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
        readonly 'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
    },
    readonly Blueprints: readonly [IMaterialBlueprints],
}

export interface IMaterialDefinition {
    readonly Definitions: IMaterialDefinitions,
}
