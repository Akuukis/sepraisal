import { Direction } from '@sepraisal/common'

import { CubeType, CubeTypePrefixed } from './CubeType'
import { IXml2js } from './xml2js'



export type BlueprintBlockDirectionEnum =
    |'Backward'
    | 'Down'
    | 'Forward'
    | 'Left'
    | 'Right'
    | 'Up'

export interface IBlueprintBlockOrientation {
    readonly Forward: Direction,
    readonly Up: Direction,
}

export interface IVector3I extends IXml2js {
    readonly X: readonly [string],
    readonly Y: readonly [string],
    readonly Z: readonly [string],
}

export interface IVector extends IXml2js {
    readonly x: string,
    readonly y: string,
    readonly z: string,
}

export interface IPhysicalContent {
    readonly $: {
        readonly 'xsi:type': string,
    }
    readonly SubtypeName: readonly [string],
}

export interface IInventoryItem {
    readonly Amount: readonly [number],
    readonly AmountDecimal: number,
    readonly ItemId: number,
    readonly PhysicalContent: unknown,
}

export interface IInventory {
    readonly InventoryFlags: readonly ['CanReceive CanSend', 'CanReceive', 'CanSend'],
    readonly Items: readonly [{MyObjectBuilder_InventoryItem: IInventoryItem[] }],
    readonly Mass: readonly [number],
    readonly nextItemId: readonly [number],
    readonly RemoveEntityOnEmpty: readonly [boolean],
    readonly Size: readonly [{readonly $: {
        readonly 'xsi:type': 'nil',
    }}],
    readonly Volume: readonly [number],
}

export interface IMyInventoryBase {
    readonly Components: readonly [{
        readonly Component: readonly [{
            readonly ComponentData: readonly [IInventory & {readonly $: {readonly 'xsi:type': 'MyObjectBuilder_Inventory'}}],
        }],
        readonly TypeId: readonly ['MyInventoryBase'],
    }],
}

export interface IMyInventoryAggregate {
    readonly Components: readonly [{
        readonly Component: readonly [{
                readonly $: {readonly 'xsi:type': 'MyObjectBuilder_InventoryAggregate'},
                readonly Inventories: readonly [{
                    readonly MyObjectBuilder_InventoryBase: Array<IInventory & {readonly $: {readonly 'xsi:type': 'MyObjectBuilder_Inventory'}}>,
                }],
                readonly InventoryId: 'Inventory',
            }],
        readonly TypeId: readonly ['MyInventoryBase'],
    }],
}


export interface IToolbar {
    readonly SelectedSlot: readonly [{readonly $: {readonly 'xsi:type': 'nil'}}]
    readonly Slots: readonly [],  // TODO
    readonly ToolbarType: readonly ['Character'],
}

namespace BlockDefinitionCategory {
    export interface IBlock<TType extends CubeType = CubeType> extends IXml2js {
        /**
        * Abstract. Required for type discrimination. See more at https://github.com/piotrwitek/utility-types.
        */
        readonly $: {readonly 'xsi:type': typeof CubeTypePrefixed[TType]},
        readonly __brand?: TType,
        readonly BlockOrientation?: readonly [{readonly $: IBlueprintBlockOrientation}],
        readonly ColorMaskHSV?: readonly [{readonly $: IVector}],
        readonly Min?: readonly [{readonly $: IVector}],  // Defaults to [0,0,0].
        readonly SubtypeName: readonly [string] | readonly [],
    }

    export interface IBlockWithId<TType extends CubeType = CubeType> extends IBlock<TType> {
        readonly EntityId: readonly [number],
    }

    export interface IEntityWithoutOwner<TType extends CubeType = CubeType> extends IBlockWithId<TType> {
        readonly CustomName: readonly [string],
        readonly Enabled: readonly ['true' | 'false'],
        readonly ShowInTerminal: readonly ['true' | 'false'],
        readonly ShowInToolbarConfig: readonly ['true' | 'false'],
        readonly ShowOnHUD: readonly ['true' | 'false'],
    }

    export interface IEntity<TType extends CubeType = CubeType> extends IEntityWithoutOwner<TType> {
        readonly ShareMode: readonly ['All' | string],  // TODO
    }

    export interface ICargoContainer<TType extends CubeType = CubeType> extends IEntity<TType> {
        readonly ComponentContainer: readonly [IMyInventoryBase],
    }

    export interface IInventoryOnesided<TType extends CubeType = CubeType> extends IEntity<TType> {
        readonly ComponentContainer: readonly [IMyInventoryBase],
        readonly Inventory: readonly [IInventory],
    }

    export interface IInventoryInOut<TType extends CubeType = CubeType> extends IEntity<TType> {
        readonly ComponentContainer: readonly [IMyInventoryBase],
        readonly InputInventory: readonly [IInventory],
        readonly OutputInventory: readonly [IInventory],
    }

    export interface IMyProgrammableBlock<TType extends CubeType = CubeType> extends IEntity<TType> {
        readonly Storage: readonly [string],
    }

    export interface ICockpit<TType extends CubeType = CubeType> extends IEntity<TType> {

        readonly AttachedPlayerId: readonly [{readonly $: {readonly 'xsi:type': 'nil'}}],
        readonly BuildToolbar: readonly [IToolbar],
        readonly ComponentContainer: readonly [IMyInventoryBase],
        readonly ControlWheels: readonly ['true' | 'false'],
        readonly HorizonIndicatorEnabled: readonly ['true' | 'false'],
        readonly IsInFirstPersonView: readonly ['true' | 'false'],
        readonly IsMainCockpit?: readonly ['true' | 'false'],
        readonly OxygenLevel: readonly [number],
        readonly PilotRelativeWorld: readonly [{readonly $: {readonly 'xsi:type': 'nil'}}],
        readonly SelectedGunId: readonly [{readonly $: {readonly 'xsi:type': 'nil'}}],
        readonly Toolbar: readonly [IToolbar],
        readonly UseSingleWeaponMode: readonly ['true' | 'false'],
    }

    export interface ITimerBlock<TType extends CubeType = CubeType> extends IEntity<TType> {
        readonly CurrentTime: readonly [number],
        readonly Delay: readonly [number],
        readonly Toolbar: readonly [IToolbar],
    }

    export interface ITextPanel<TType extends CubeType = CubeType> extends IEntity<TType> {
        readonly AccessFlag: readonly [string],  // TODO
        readonly BackgroundColor: unknown,  // TODO
        readonly ChangeInterval: readonly [number],
        readonly CurrentShownTexture: readonly [number],
        readonly Description: readonly [string],
        readonly FontColor: unknown,  // TODO
        readonly FontSize: readonly [number],
        readonly PublicDescription: readonly [string],
        readonly PublicTitle: readonly [string],
        readonly ShowText: readonly [string],
        readonly Title: readonly [string],
    }

}

export type BlockDefinition<T extends CubeType = CubeType> = Extract<
        | BlockDefinition.ICubeBlock
        | BlockDefinition.IConveyor
        | BlockDefinition.IConveyorConnector
        | BlockDefinition.ILandingGear
        | BlockDefinition.IThrust
        | BlockDefinition.IAirVent
        | BlockDefinition.IAirtightSlideDoor
        | BlockDefinition.IBeacon
        | BlockDefinition.IGyro
        | BlockDefinition.IOreDetector
        | BlockDefinition.IMedicalRoom
        | BlockDefinition.IInteriorLight
        | BlockDefinition.ICargoContainer
        | BlockDefinition.IOxygenGenerator
        | BlockDefinition.IOxygenTank
        | BlockDefinition.IReactor
        | BlockDefinition.IRefinery
        | BlockDefinition.IAssembler
        | BlockDefinition.IProgrammableBlock
        | BlockDefinition.ICockpit
        | BlockDefinition.ITimerBlock
        | BlockDefinition.ITextPanel
    ,
        BlockDefinitionCategory.IBlock<T>
    >


export namespace BlockDefinition {
    export interface ICubeBlock         extends BlockDefinitionCategory.IBlock              <CubeType.CubeBlock> {}
    export interface IConveyor          extends BlockDefinitionCategory.IBlockWithId        <CubeType.Conveyor> {}
    export interface IConveyorConnector extends BlockDefinitionCategory.IBlockWithId        <CubeType.ConveyorConnector> {}
    export interface ILandingGear       extends BlockDefinitionCategory.IEntityWithoutOwner <CubeType.LandingGear> {}
    export interface IThrust            extends BlockDefinitionCategory.IEntityWithoutOwner <CubeType.Thrust> {}
    export interface IAirVent           extends BlockDefinitionCategory.IEntity             <CubeType.AirVent> {}
    export interface IAirtightSlideDoor extends BlockDefinitionCategory.IEntity             <CubeType.AirtightSlideDoor> {}
    export interface IBeacon            extends BlockDefinitionCategory.IEntity             <CubeType.Beacon> {}
    export interface IGyro              extends BlockDefinitionCategory.IEntity             <CubeType.Gyro> {}
    export interface IOreDetector       extends BlockDefinitionCategory.IEntity             <CubeType.OreDetector> {}
    export interface IMedicalRoom       extends BlockDefinitionCategory.IEntity             <CubeType.MedicalRoom> {}
    export interface IInteriorLight     extends BlockDefinitionCategory.IEntity             <CubeType.InteriorLight> {}
    export interface ICargoContainer    extends BlockDefinitionCategory.ICargoContainer     <CubeType.CargoContainer> {}
    export interface IOxygenGenerator   extends BlockDefinitionCategory.IInventoryOnesided  <CubeType.OxygenGenerator> {}
    export interface IOxygenTank        extends BlockDefinitionCategory.IInventoryOnesided  <CubeType.OxygenTank> {}
    export interface IReactor           extends BlockDefinitionCategory.IInventoryOnesided  <CubeType.Reactor> {}
    export interface IRefinery          extends BlockDefinitionCategory.IInventoryInOut     <CubeType.Refinery> {}
    export interface IAssembler         extends BlockDefinitionCategory.IInventoryInOut     <CubeType.Assembler> {}
    export interface IProgrammableBlock extends BlockDefinitionCategory.ITextPanel          <CubeType.ProgrammableBlock> {}
    export interface ICockpit           extends BlockDefinitionCategory.ICockpit            <CubeType.Cockpit> {}
    export interface ITimerBlock        extends BlockDefinitionCategory.ITimerBlock         <CubeType.TimerBlock> {}
    export interface ITextPanel         extends BlockDefinitionCategory.IMyProgrammableBlock<CubeType.TextPanel> {}
}

export interface IBlueprintBlockGroup extends IXml2js {
    readonly Blocks: readonly [{
        readonly Vector3I: IVector3I[],
    }],
    readonly Name: readonly [string],
}

export interface IBlueprintBlockGroups extends IXml2js {
    readonly MyObjectBuilder_BlockGroup: IBlueprintBlockGroup[],
}

export interface IBlueprintCubeGrid extends IXml2js {
    readonly BlockGroups?: readonly [{
        readonly MyObjectBuilder_BlockGroup: IBlueprintBlockGroup[],
    }]
    readonly ConveyorLines: unknown,
    readonly CubeBlocks: readonly [{
        readonly MyObjectBuilder_CubeBlock: BlockDefinition[],
    }],
    readonly DestructibleBlocks?: readonly ['true'],
    readonly DisplayName: readonly [string],
    readonly EntityId: readonly [string],
    readonly GridSizeEnum: readonly ['Large' | 'Small'],
    readonly IsRespawnGrid?: readonly ['true'],
    readonly IsStatic?: readonly ['true'],
    readonly LocalCoordSys: readonly [string],
    readonly OxygenAmount: unknown,
    readonly PersistentFlags: readonly [string],
    readonly PositionAndOrientation: unknown,
    readonly SubtypeName: readonly [string],
    readonly TargetingTargets: readonly [string],
}

export interface IBlueprintCubeGrids extends IXml2js {
    readonly CubeGrid: IBlueprintCubeGrid[],
}
