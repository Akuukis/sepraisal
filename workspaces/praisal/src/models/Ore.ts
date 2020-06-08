import { VENDOR_MOD } from '@sepraisal/common/src'

import { IParsePhysicalItemsSbc } from '../parsers'


export interface IOreDTO {
    mass: number
    subtype: string
    type: string
    volume: number
}

export class Ore implements IOreDTO {

    public static fromSbcs(physicalItemsSbcs: Map<string, IParsePhysicalItemsSbc>): Ore[] {
        return [...physicalItemsSbcs.values()]
            .filter((sbc) => sbc.type === 'Ore')
            .map((blockDto) => new Ore(blockDto, blockDto.mod))
    }


    public get title(): string { return `${this.type}/${this.subtype}`}
    public readonly mass: number  // kg.
    public readonly subtype: string
    public readonly type: string
    public readonly volume: number  // l.
    public readonly mod: VENDOR_MOD

    public constructor(dto: IOreDTO, mod: VENDOR_MOD) {
        this.type = dto.type
        this.subtype = dto.subtype
        this.mass = dto.mass
        this.volume = dto.volume
        this.mod = mod
    }

    public toJSON(): IOreDTO {
        return {
            mass: this.mass,
            subtype: this.subtype,
            type: this.type,
            volume: this.volume,
        }
    }

}
