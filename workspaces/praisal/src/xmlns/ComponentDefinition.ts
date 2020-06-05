import { IXml2js } from './xml2js'

export interface IComponentId extends IXml2js {
    readonly SubtypeId: readonly [string],
    readonly TypeId: readonly ['CubeBlock'],
}

export interface IComponentSize extends IXml2js {
    readonly X: readonly [number],
    readonly Y: readonly [number],
    readonly Z: readonly [number],
}

export interface IComponentBlueprint extends IXml2js {
    readonly DisplayName: readonly [string],
    readonly Health: readonly [number],
    readonly Id: readonly [IComponentId],
    readonly Mass: readonly [number],
    readonly MaxIntegrity: readonly [number],
    readonly Size: readonly [IComponentSize],
    readonly Volume: readonly [number],
    // ...
}

export interface IComponentBlueprints extends IXml2js {
    readonly Component: readonly [IComponentBlueprint],
}

export interface IComponentDefinitions extends IXml2js {
    readonly $: {
        readonly 'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
        readonly 'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
    },
    readonly Components: readonly [IComponentBlueprints],
}

export interface IComponentDefinition {
    readonly Definitions: IComponentDefinitions,
}
