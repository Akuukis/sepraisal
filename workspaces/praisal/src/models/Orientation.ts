import { Direction, IOrientation } from '@sepraisal/common/src'


export type TranslationEnum = '+x' | '+y' | '+z' | '-x' | '-y' | '-z'
export type TranslationMinEnum = 'x' | 'y' | 'z'

type OrientationEnum =
    | 'Forward-Up'
    | 'Forward-Down'
    | 'Backward-Up'
    | 'Backward-Down'
    | 'Forward-Right'
    | 'Forward-Left'
    | 'Backward-Right'
    | 'Backward-Left'
    | 'Up-Forward'
    | 'Up-Backward'
    | 'Down-Forward'
    | 'Down-Backward'
    | 'Up-Right'
    | 'Up-Left'
    | 'Down-Right'
    | 'Down-Left'
    | 'Right-Forward'
    | 'Right-Backward'
    | 'Left-Forward'
    | 'Left-Backward'
    | 'Right-Up'
    | 'Right-Down'
    | 'Left-Up'
    | 'Left-Down'

export interface ITranslation {
    x: TranslationEnum,
    y: TranslationEnum,
    z: TranslationEnum,
}
export interface ITranslationMin {
    x: TranslationMinEnum,
    y: TranslationMinEnum,
    z: TranslationMinEnum,
}
export interface ICoords {
    x: number,
    y: number,
    z: number,
}

const oppositeTo = (direction: Direction): Direction => {
    switch(direction) {
        case(Direction.Forward): return Direction.Backward
        case(Direction.Backward): return Direction.Forward
        case(Direction.Up): return Direction.Down
        case(Direction.Down): return Direction.Up
        case(Direction.Right): return Direction.Left
        case(Direction.Left): return Direction.Right
        default: throw new Error(direction)
    }
}

const rightOf = ({Forward, Up}: Orientation): Direction => {
    switch(`${Forward}-${Up}` as OrientationEnum) {
        case('Forward-Up'): return Direction.Right
        case('Forward-Down'): return Direction.Left
        case('Backward-Up'): return Direction.Left
        case('Backward-Down'): return Direction.Right
        case('Forward-Right'): return Direction.Down
        case('Forward-Left'): return Direction.Up
        case('Backward-Right'): return Direction.Up
        case('Backward-Left'): return Direction.Down
        case('Up-Forward'): return Direction.Left
        case('Up-Backward'): return Direction.Right
        case('Down-Forward'): return Direction.Right
        case('Down-Backward'): return Direction.Left
        case('Up-Right'): return Direction.Forward
        case('Up-Left'): return Direction.Backward
        case('Down-Right'): return Direction.Backward
        case('Down-Left'): return Direction.Forward
        case('Right-Forward'): return Direction.Up
        case('Right-Backward'): return Direction.Down
        case('Left-Forward'): return Direction.Down
        case('Left-Backward'): return Direction.Up
        case('Right-Up'): return Direction.Backward
        case('Right-Down'): return Direction.Forward
        case('Left-Up'): return Direction.Forward
        case('Left-Down'): return Direction.Backward
        default: throw new Error(`${Forward}-${Up}`)
    }
}

const leftOf = ({Forward, Up}: Orientation): Direction => {
    switch(`${Forward}-${Up}` as OrientationEnum) {
        case('Forward-Up'): return Direction.Left
        case('Forward-Down'): return Direction.Right
        case('Backward-Up'): return Direction.Right
        case('Backward-Down'): return Direction.Left
        case('Forward-Right'): return Direction.Up
        case('Forward-Left'): return Direction.Down
        case('Backward-Right'): return Direction.Down
        case('Backward-Left'): return Direction.Up
        case('Up-Forward'): return Direction.Right
        case('Up-Backward'): return Direction.Left
        case('Down-Forward'): return Direction.Left
        case('Down-Backward'): return Direction.Right
        case('Up-Right'): return Direction.Backward
        case('Up-Left'): return Direction.Forward
        case('Down-Right'): return Direction.Forward
        case('Down-Left'): return Direction.Backward
        case('Right-Forward'): return Direction.Down
        case('Right-Backward'): return Direction.Up
        case('Left-Forward'): return Direction.Up
        case('Left-Backward'): return Direction.Down
        case('Right-Up'): return Direction.Forward
        case('Right-Down'): return Direction.Backward
        case('Left-Up'): return Direction.Backward
        case('Left-Down'): return Direction.Forward
        default: throw new Error(`${Forward}-${Up}`)
    }
}

export class Orientation implements IOrientation {
    public Forward: Direction
    public Up: Direction

    public constructor(Forward: Direction, Up: Direction) {
        this.Forward = Forward
        this.Up = Up
    }

    public turnAround(): Orientation {
        return new Orientation(oppositeTo(this.Forward), this.Up)
    }

    public upsideDown(): Orientation {
        return new Orientation(this.Forward, oppositeTo(this.Up))
    }

    public turnDown(): Orientation {
        return new Orientation(oppositeTo(this.Up), this.Forward)
    }

    public turnUp(): Orientation {
        return new Orientation(this.Up, oppositeTo(this.Forward))
    }

    public turnRight(): Orientation {
        return new Orientation(rightOf(this), this.Up)
    }

    public turnLeft(): Orientation {
        return new Orientation(leftOf(this), this.Up)
    }

    public fallRight(): Orientation {
        return new Orientation(this.Forward, rightOf(this))
    }

    public fallLeft(): Orientation {
        return new Orientation(this.Forward, leftOf(this))
    }

    public translateForMin(): ITranslationMin {
        switch(`${this.Forward}-${this.Up}`) {
            case('Forward-Up'): return {x: 'x', y: 'y', z: 'z'}  //
            case('Forward-Down'): return {x: 'x', y: 'y', z: 'z'}  //
            case('Backward-Up'): return {x: 'x', y: 'y', z: 'z'}  //
            case('Backward-Down'): return {x: 'x', y: 'y', z: 'z'}  //
            case('Forward-Right'): return {x: 'y', y: 'x', z: 'z'}  // ???
            case('Forward-Left'): return {x: 'y', y: 'x', z: 'z'}  // ???
            case('Backward-Right'): return {x: 'y', y: 'x', z: 'z'}  //
            case('Backward-Left'): return {x: 'y', y: 'x', z: 'z'}  //
            case('Up-Forward'): return {x: 'x', y: 'z', z: 'y'}  //
            case('Up-Backward'): return {x: 'x', y: 'z', z: 'y'}  //
            case('Down-Forward'): return {x: 'x', y: 'z', z: 'y'}  //
            case('Down-Backward'): return {x: 'x', y: 'z', z: 'y'}  //
            case('Up-Right'): return {x: 'y', y: 'z', z: 'x'}  //
            case('Up-Left'): return {x: 'y', y: 'z', z: 'x'}  //
            case('Down-Right'): return {x: 'y', y: 'z', z: 'x'}  // ???
            case('Down-Left'): return {x: 'y', y: 'z', z: 'x'}  // ???
            case('Right-Forward'): return {x: 'z', y: 'x', z: 'y'}  // ???
            case('Right-Backward'): return {x: 'z', y: 'x', z: 'y'}  //
            case('Left-Forward'): return {x: 'z', y: 'x', z: 'y'}  // ???
            case('Left-Backward'): return {x: 'z', y: 'x', z: 'y'}  //
            case('Right-Up'): return {x: 'z', y: 'y', z: 'x'}  //
            case('Right-Down'): return {x: 'z', y: 'y', z: 'x'}  //
            case('Left-Up'): return {x: 'z', y: 'y', z: 'x'}  // ???
            case('Left-Down'): return {x: 'z', y: 'y', z: 'x'}  // ???
            default: throw new Error(`${this.Forward}-${this.Up}`)
        }
    }

    public translate(coords: ICoords): ICoords {
        switch(`${this.Forward}-${this.Up}`) {
            case('Forward-Up'): return {x:  coords.x,    y:  coords.y,    z:  coords.z}  //
            case('Forward-Down'): return {x:  coords.x,    y:  coords.y,    z:  coords.z}  //
            case('Backward-Up'): return {x: -coords.x,    y:  coords.y,    z:  coords.z}  //
            case('Backward-Down'): return {x:  coords.x,    y:  coords.y,    z:  coords.z}  //
            case('Forward-Right'): return {x:  coords.y,    y:  coords.x,    z:  coords.z}  // ???
            case('Forward-Left'): return {x:  coords.y,    y:  coords.x,    z:  coords.z}  // ???
            case('Backward-Right'): return {x:  coords.y,    y:  coords.x,    z:  coords.z}  //
            case('Backward-Left'): return {x:  coords.y,    y:  coords.x,    z:  coords.z}  //
            case('Up-Forward'): return {x:  coords.x,    y:  coords.z,    z:  coords.y}  //
            case('Up-Backward'): return {x:  coords.x,    y:  coords.z,    z:  coords.y}  //
            case('Down-Forward'): return {x:  coords.x,    y: -coords.z,    z:  coords.y}  //
            case('Down-Backward'): return {x:  coords.x,    y:  coords.z,    z:  coords.y}  //
            case('Up-Right'): return {x:  coords.y,    y:  coords.z,    z:  coords.x}  //
            case('Up-Left'): return {x:  coords.y,    y:  coords.z,    z:  coords.x}  //
            case('Down-Right'): return {x:  coords.y,    y:  coords.z,    z:  coords.x}  // ???
            case('Down-Left'): return {x:  coords.y,    y:  coords.z,    z:  coords.x}  // ???
            case('Right-Forward'): return {x:  coords.z,    y:  coords.x,    z:  coords.y}  // ???
            case('Right-Backward'): return {x:  coords.z,    y:  coords.x,    z:  coords.y}  //
            case('Left-Forward'): return {x:  coords.z,    y:  coords.x,    z:  coords.y}  // ???
            case('Left-Backward'): return {x:  coords.z,    y:  coords.x,    z:  coords.y}  //
            case('Right-Up'): return {x: -coords.z,    y:  coords.y,    z:  coords.x}  //
            case('Right-Down'): return {x:  coords.z,    y:  coords.y,    z:  coords.x}  //
            case('Left-Up'): return {x:  coords.z,    y:  coords.y,    z:  coords.x}  // ???
            case('Left-Down'): return {x:  coords.z,    y:  coords.y,    z:  coords.x}  // ???
            default: throw new Error(`${this.Forward}-${this.Up}`)
        }
    }

    public x(coords: ICoords = {x: 1, y: 1, z: 1}): number {
        return this.translate(coords).x
    }

    public y(coords: ICoords = {x: 1, y: 1, z: 1}): number {
        return this.translate(coords).y
    }

    public z(coords: ICoords = {x: 1, y: 1, z: 1}): number {
        return this.translate(coords).z
    }
}
