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
    
    public static fromSbcs(physicalItemsSbcs: Map<string, IParsePhysicalItemsSbc>, blueprintSbcs: Map<string, IParseBlueprintSbc>): Ingot[] {
        const fullTypes = new Set(([] as Array<{fullType: string}>)
            .concat([...physicalItemsSbcs.values()].filter((sbc) => sbc.type === 'Ingot' && sbc.subtype !== 'Scrap'))
            .concat([...blueprintSbcs.values()].filter((sbc) => sbc.type === 'Ingot'))
            .map((sbc) => sbc.fullType)
        )
        return [...fullTypes.values()]
            .filter((fullType) => {
                if (fullType === 'Ingot/PrototechScrap') {
                    process.stdout.write(`Excluding ${fullType}\n`)
                    return false
                }
                return true
            }) // Exclude Ingot/PrototechScrap
            .map((fullType) => {
                const physicalItemsSbc = physicalItemsSbcs.get(fullType)
                if(!physicalItemsSbc) throw new Error(`Ingot "${fullType}" not found in "PhysicalItems.sbc".`)
                const blueprintSbc = blueprintSbcs.get(fullType)
                if(!blueprintSbc) {
                    process.stdout.write(`Blueprints available: ${Array.from(blueprintSbcs.keys()).join(', ')}\n`)
                    process.stdout.write(`Requested blueprint: ${fullType}\n`)
                    throw new Error(`Ingot "${fullType}" not found in "Blueprints.sbc".`)
                }

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
        this.prerequisites = dto.prerequisites
        this.time = dto.time
        this.volume = dto.volume
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