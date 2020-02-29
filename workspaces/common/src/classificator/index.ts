import { AbstractBpClass } from './Class'
import { VC0 } from './vehicle/VC0-_default'
import { VC1 } from './vehicle/VC1-_default'
import { Fighter } from './vehicle/VC1-fighter'
import { Vehicle } from './vehicle/vehicle'

const vehicle = new Vehicle()

const vehicleClass0 = new VC0(vehicle)

const vehicleClass1 = new VC1(vehicle)
const fighter = new Fighter(vehicleClass1)


export const CLASSES = {
    fighter,
    vehicle,
    vehicleClass0,
    vehicleClass1,
}

export { IFind } from './Class'
export type ClassName = typeof CLASSES extends Record<keyof typeof CLASSES, AbstractBpClass<infer T>> ? T : never
