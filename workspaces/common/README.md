Common
================================================================================

Commons house three things: utilities, Data Model for Blueprint, and Class Classificator




Data Model for Blueprint: `IBlueprint`
--------------------------------------------------------------------------------

This is the datum that travels between backend (lambda working with MongoDB) and frontend (React app).

```ts
interface IBlueprint {
    /* 0 */ _id: number
    /* 1 */ steam?: IBlueprint.ISteam
    /* 2 */ thumb?: IBlueprint.IThumb
    /* 3 */ sbc?: IBlueprint.ISbc
    /* 4 */ classes?: IBlueprint.IClasses
}
```

It implicitly has 5 variants, derived on the presence of properties sequentially, e.g. if it has `thumb` property, then is *must have* also `steam` property. It's because the logic that creates and updates higher level properties depends on information of lower properties.

Please find the details of properties at [source files](./src/IBlueprint.ts).

*TODO*: In near future I plan to move `thumb` after `sbc`, so that if steam doesn't have thumb it can be generated from silhouette.

*TODO 2*: In further future I plan to add 6th property called "badges" instead of having them spread as subproperties of `steam` and `sbc`.




Class Classificator: `CLASSES`
--------------------------------------------------------------------------------

Class Classificator is a simple and highly opinionated two-level structure. There are two classificators, for Station and Vehicle.
1. Class depends on size. It's a mix of requirements for PCU, block count and total ore.
2. Subclass depends on role. Those are unique for each class, and depends mainly on specific blocks or performance.

### Station Classes
TODO

### Vehicle classes
- VC0
  - Torpedo: "Dumb" projective, maybe with thrusters.
  - Missile: "Smart" projective, with thrusters and guiding.
  - Drone: like anything from VC1 but smaller.
  - ...
- VC1, aka "Crafts" (like "Spacecraft", "Wheelcraft", "Omnicraft", etc.). small small-block vehicle.
  - Fighter
  - ...
- VC2, aka "Small Ships". big small-block vehicle.
  - ...
- VC3, aka "Corvette". Small size big-block vehicle without jump drive.
  - ...
- VC4, aka "Frigate". Medium size vehicle with jump drive.
  - Industrial: Has decent capacity to process ores and assemble components.
  - ...
- VC5, aka "Destroyer"/"Cruiser"/"Carrier". Large size vehicle with multiple jump drives.
  - Destroyer: has non-standard weapon. Named after type of weapon, e.g. "Gravcannon Destroyer".
  - Carrier: stores, repairs and produces VC1. Named after type of VC1s, e.g. "Fighter Carrier".
  - Cruiser: has many many jump drives.
  - Industrial: Has decent capacity to process ores and assemble components.
  - ...
- VC6, aka "Battleship"/"Dreadnought". Huge size vehicle too big for solo-MP but rather a guild effort.
  - ...
- VC7, aka "Titan". Enourmous size vehicles that crash game or is otherwise unbearable even in creative SP.
