import { IVector, IVector3I } from './BlueprintDefinition'
import { CubeType, CubeTypePrefixedDefinition } from './CubeType'
import { IXml2js } from './xml2js'


// tslint:disable: max-union-size max-line-length


// tslint:disable-next-line: no-unused - TODO put in type
export interface ICubeId<T extends string = string> extends IXml2js {
    readonly SubtypeId: readonly [string],
    readonly TypeId: readonly [string],
}

export interface ICubeComponent extends IXml2js {
    readonly $: {
        readonly Count: number,
        readonly Subtype: string,
    },
}

// Everything hasICubeSize1, but Ladder has ICubeSize2.
export interface ICubeSize1 extends IXml2js {
    readonly $: IVector
}
export interface ICubeSize2 extends IXml2js, IVector3I {
}

export interface ICubeComponents extends IXml2js {
    readonly Component: readonly [ICubeComponent],
}

export interface ICubeDTOBlockVariants extends IXml2js {
    readonly BlockVariant: Array<ICubeId<CubeType>>
}


export namespace CubeDTOCategory {
    export interface IBase<T extends CubeType = CubeType> extends IXml2js {
        /**
        * Abstract. Required for type discrimination. See more at https://github.com/piotrwitek/utility-types.
        */
        readonly __brand?: T,
        readonly BlockPairName?: readonly [string],
        readonly BlockTopology: readonly ['Cube' | 'TriangleMesh'],
        readonly BlockVariants?: readonly [ICubeDTOBlockVariants],
        readonly BuildProgressModels: unknown,
        readonly BuildTimeSeconds?: readonly [number],
        readonly Components: readonly [ICubeComponents],
        readonly CriticalComponent: readonly [ICubeComponent],
        readonly CubeDefinition: unknown,
        readonly CubeSize: readonly ['Large' | 'Small'],
        readonly DeformationRatio?: readonly [number],
        readonly DisassembleRatio?: readonly [number],  // Default to 1
        readonly DisplayName: readonly [string],
        readonly EdgeType?: readonly ['Light'],
        readonly GuiVisible?: readonly [false],
        readonly Icon: readonly [string],
        readonly Id: readonly [ICubeId<T>],
        readonly IsAirTight?: readonly ['true'],
        readonly MirroringX?: readonly [string],
        readonly MirroringY?: readonly [string],
        readonly MirroringZ?: readonly [string],
        readonly ModelOffset: IVector,
        readonly MountPoints: unknown,
        readonly NavigationDefinition: readonly ['Default'],
        readonly PCU: readonly [number],
        readonly PCUConsole?: readonly [number],
        readonly Size: readonly [ICubeSize1 | ICubeSize2],
        readonly Skeleton: unknown,
        readonly Variants: unknown,
        readonly VoxelPlacement?: unknown,
    }

    export interface ICube<T extends CubeType = CubeType> extends IBase<T> {
        readonly BlockTopology: readonly ['Cube'],
        readonly PhysicsOption: readonly ['Convex'],
    }

    export interface ITriangleMesh<T extends CubeType = CubeType> extends IBase<T> {
        readonly $: {readonly 'xsi-type': typeof CubeTypePrefixedDefinition[T]},
        readonly BlockTopology: readonly ['TriangleMesh'],
        readonly DamagedSound?: readonly [string],
        readonly DamageEffectName?: readonly [string],
        readonly DestroyEffect?: readonly [string],
        readonly DestroySound?: readonly [string],
        readonly EmissiveColorPreset?: readonly [string],  // Not all
        readonly HasPhysics?: readonly ['false'],
        readonly IdlePowerConsumption?: readonly [number],
        readonly IdleSound?: readonly [string],
        readonly IsStandAlone?: readonly ['false'],
        readonly MaxPowerOutput?: readonly [number],
        readonly Model: readonly [string],
        readonly OperationalPowerConsumption?: readonly [number],
        readonly PrimarySound?: readonly [string],
        readonly Public?: readonly ['true' | 'false'],
        readonly RequiredPowerInput?: readonly [number],
        readonly ResourceSourceGroup?: readonly ['Battery' | 'Reactors' | 'SolarPanels'],
        readonly ResourseSinkGroup?: readonly ['BatteryBlock' | 'Charging' | 'Conveyors' | 'Defense' | 'Doors' | 'Factory' | 'Gyro' | 'Thrust' | 'Utility'],
        readonly StandbyPowerConsumption?: readonly [number],
    }

    export interface IWindow<T extends CubeType = CubeType> extends ITriangleMesh<T> {
        readonly MirroringBlock?: readonly [string],
        readonly PhysicalMaterial: readonly ['Glass'],
    }

    export interface IBattery<T extends CubeType = CubeType> extends ITriangleMesh<T> {
        readonly InitialStoredPowerRatio: readonly [number],
        readonly InventorySize: IVector3I,
        readonly MaxPowerOutput: readonly [number],
        readonly MaxStoredPower: readonly [number],
        readonly RequiredPowerInput: readonly [number],
        readonly ResourceSinkGroup: readonly ['BatteryBlock'],
        readonly ResourceSourceGroup: readonly ['Battery'],
    }

    export interface IWheel<T extends CubeType = CubeType> extends ITriangleMesh<T> {
        readonly PhysicalMaterial: readonly ['Wheel'],
    }

    export interface IButtonPanel<T extends CubeType = CubeType> extends ITriangleMesh<T> {
        readonly ButtonColors: unknown,
        readonly ButtonCount: readonly [number],
        readonly ButtonSymbols: unknown,
        readonly UnassignedButtonColor: unknown,
    }

    export interface ITurret<T extends CubeType = CubeType> extends ITriangleMesh<T> {
        readonly ElevationSpeed: readonly [number],
        readonly IdleRotation: readonly [boolean],
        readonly InventoryMaxVolume: readonly [number],
        readonly MaxAzimuthDegrees: readonly [number],
        readonly MaxElevationDegrees: readonly [number],
        readonly MaxFov: readonly [number],
        readonly MaxRangeMeters: readonly [number],
        readonly MinAzimuthDegrees: readonly [number],
        readonly MinElevationDegrees: readonly [number],
        readonly MinFov: readonly [number],
        readonly RotationSpeed: readonly [number],
        readonly UseModelIntersection: readonly [boolean],
        readonly WeaponDefinitionId: readonly [{readonly $: {readonly Subtype: 'SmallGatlingTurret'}}],
    }

    export interface IThrust<T extends CubeType = CubeType> extends ITriangleMesh<T> {
        readonly Center: readonly [IVector],
        readonly FlameDamageLengthScale: readonly [number],
        readonly FlameLengthScale: readonly [number],
        readonly ForceMagnitude: readonly [number],
        readonly FuelConverter: readonly [{
            readonly Efficiency: readonly [number],
            readonly FuelId: readonly [ICubeId<'GasProperties'>],
        }]
        readonly MaxPowerConsumption: readonly [number],
        readonly MinPowerConsumption: readonly [number],
        readonly ResourceSinkGroup: readonly ['Thrust'],
        readonly SilenceableByShipSoundSystem: readonly [boolean],
        readonly SlowdownFactor: readonly [number],
        readonly ThrusterType: readonly ['Hydrogen' | 'Ion' | 'Atmospheric'],
        // readonly FlameIdleColor: unknown,
        // readonly FlameFullColor: unknown,
        // readonly FlamePointMaterial: readonly [string],
        // readonly FlameLengthMaterial: readonly [string],
        // readonly FlameFlare: readonly [string],
        // readonly FlameVisibilityDistance: readonly [string],
        // readonly FlameGlareQuerySize: readonly [string],
    }
}

export type CubeDTO<T extends CubeType = CubeType> = Extract<
        | CubeDTO.ICubeBlock
        | CubeDTO.IConveyor
        | CubeDTO.IConveyorConnector
        | CubeDTO.ILandingGear
        | CubeDTO.IThrust
        | CubeDTO.IAirVent
        | CubeDTO.IAirtightSlideDoor
        | CubeDTO.IBeacon
        | CubeDTO.IGyro
        | CubeDTO.IOreDetector
        | CubeDTO.IMedicalRoom
        | CubeDTO.IInteriorLight
        | CubeDTO.ICargoContainer
        | CubeDTO.IOxygenGenerator
        | CubeDTO.IOxygenTank
        | CubeDTO.IReactor
        | CubeDTO.IRefinery
        | CubeDTO.IAssembler
        | CubeDTO.IProgrammableBlock
        | CubeDTO.ICockpit
        | CubeDTO.ITimerBlock
        | CubeDTO.ITextPanel
    ,
        CubeDTOCategory.IBase<T>
    >

export namespace CubeDTO {
    export interface ICubeBlock         extends CubeDTOCategory.ICube         <CubeType.CubeBlock> {}
    export interface IConveyor          extends CubeDTOCategory.IBase        <CubeType.Conveyor> {}
    export interface IConveyorConnector extends CubeDTOCategory.IBase        <CubeType.ConveyorConnector> {}
    export interface ILandingGear       extends CubeDTOCategory.IBase        <CubeType.LandingGear> {}
    export interface IThrust            extends CubeDTOCategory.IThrust       <CubeType.Thrust> {}
    export interface IAirVent           extends CubeDTOCategory.IBase        <CubeType.AirVent> {}
    export interface IAirtightSlideDoor extends CubeDTOCategory.IBase        <CubeType.AirtightSlideDoor> {}
    export interface IBeacon            extends CubeDTOCategory.IBase        <CubeType.Beacon> {}
    export interface IGyro              extends CubeDTOCategory.IBase        <CubeType.Gyro> {}
    export interface IOreDetector       extends CubeDTOCategory.IBase        <CubeType.OreDetector> {}
    export interface IMedicalRoom       extends CubeDTOCategory.IBase        <CubeType.MedicalRoom> {}
    export interface IInteriorLight     extends CubeDTOCategory.IBase        <CubeType.InteriorLight> {}
    export interface ICargoContainer    extends CubeDTOCategory.IBase        <CubeType.CargoContainer> {}
    export interface IOxygenGenerator   extends CubeDTOCategory.IBase        <CubeType.OxygenGenerator> {}
    export interface IOxygenTank        extends CubeDTOCategory.IBase        <CubeType.OxygenTank> {}
    export interface IReactor           extends CubeDTOCategory.IBase        <CubeType.Reactor> {}
    export interface IRefinery          extends CubeDTOCategory.IBase        <CubeType.Refinery> {}
    export interface IAssembler         extends CubeDTOCategory.IBase        <CubeType.Assembler> {}
    export interface IProgrammableBlock extends CubeDTOCategory.IBase        <CubeType.ProgrammableBlock> {}
    export interface ICockpit           extends CubeDTOCategory.IBase        <CubeType.Cockpit> {}
    export interface ITimerBlock        extends CubeDTOCategory.IBase        <CubeType.TimerBlock> {}
    export interface ITextPanel         extends CubeDTOCategory.IBase        <CubeType.TextPanel> {}
}


export interface ICubes extends IXml2js {
    readonly Definition: CubeDTO[],
}

export interface ICubeDefinitions extends IXml2js {
    readonly $: {
        readonly 'xmlns:xsd': 'http://www.w3.org/2001/XMLSchema',
        readonly 'xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
    },
    readonly BlockPositions: unknown,
    readonly CubeBlocks: readonly [ICubes],
}

export interface ICubeDefinition {
    readonly Definitions: ICubeDefinitions,
}
