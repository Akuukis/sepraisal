import { IXml2js } from './xml2js.ts'

export interface IPhysicalItemId extends IXml2js {
    readonly SubtypeId: readonly [string],
    readonly TypeId: readonly [string],
}

export interface IComponentSize extends IXml2js {
    readonly X: readonly [number],
    readonly Y: readonly [number],
    readonly Z: readonly [number],
}

export interface IPhysicalItemBlueprint extends IXml2js {
    readonly DisplayName: readonly [string],
    readonly Id: readonly [IPhysicalItemId],
    readonly Mass: readonly [number],
    readonly Size: readonly [IComponentSize],
    readonly Volume: readonly [number],
    // ...
}

export interface IPhysicalItemBlueprints extends IXml2js {
    readonly PhysicalItem: readonly [IPhysicalItemBlueprint],
}

export interface IPhysicalItemDefinitions extends IXml2js {
    readonly $: {
        readonly 'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
        readonly 'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
    },
    readonly PhysicalItems: readonly [IPhysicalItemBlueprints],
}

export interface IPhysicalItemDefinition {
    readonly Definitions: readonly [IPhysicalItemDefinitions],
}
