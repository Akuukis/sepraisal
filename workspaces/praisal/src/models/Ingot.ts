import { VENDOR_MOD } from '@sepraisal/common/src'

import { IParseBlueprintSbc, IParsePhysicalItemsSbc } from '../parsers'

export interface IIngotDTO {
    mass: number  // kg.
    prerequisites: Record<string, number>
    subtype: string
    time: number
    type: string
    volume: number  // l.
}

export class Ingot implements IIngotDTO {

    public static fromSbcs(
        physicalItemsSbcs: Map<string, IParsePhysicalItemsSbc>,
        blueprintSbcs: Map<string, IParseBlueprintSbc>
    ): Ingot[] {
        const fullTypes = new Set(([] as Array<{fullType: string}>)
            .concat([...physicalItemsSbcs.values()].filter((sbc) => sbc.type === 'Ingot' && sbc.subtype !== 'Scrap'))
            .concat([...blueprintSbcs.values()].filter((sbc) => sbc.type === 'Ingot'))
            .map((sbc) => sbc.fullType)
        )
        return [...fullTypes.values()]
        //following exludes prototype scrap ingot for error reasons
        //TODO: fix what the real problem is
        .filter((fullType) => {
            if (fullType === 'Ingot/PrototechScrap') {
                return false
            }
            return true
        }) 
        // end of the custom filter code, back to original source
            .map((fullType) => {
                const physicalItemsSbc = physicalItemsSbcs.get(fullType)
                if(!physicalItemsSbc) throw new Error(`Ingot "${fullType}" not found in "PhysicalItems.sbc".`)
                const blueprintSbc = blueprintSbcs.get(fullType)
                if(!blueprintSbc) throw new Error(`Ingot "${fullType}" not found in "Blueprint.sbc".`)

                return {
                    ...physicalItemsSbc,
                    ...blueprintSbc,
                }
            })
            .map((dto) => new Ingot(dto, dto.mod))
    }

    public readonly mass: number  // kg.


    public get title(): string { return `${this.type}/${this.subtype}`}

    public readonly prerequisites: Record<string, number>
    public readonly subtype: string
    public readonly time: number  // Seconds to build, baseBuildTime.
    public readonly type: string
    public readonly volume: number  // l.
    public readonly mod: VENDOR_MOD

    public constructor(dto: IIngotDTO, mod: VENDOR_MOD) {
        this.type = dto.type
        this.subtype = dto.subtype
        this.mass = dto.mass
        this.volume = dto.volume
        this.time = dto.time
        this.prerequisites = dto.prerequisites
        this.mod = mod
    }

    public toJSON(): IIngotDTO {
        return {
            mass: this.mass,
            prerequisites: this.prerequisites,
            subtype: this.subtype,
            time: this.time,
            type: this.type,
            volume: this.volume,
        }
    }

}
