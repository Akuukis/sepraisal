import { VENDOR_MOD } from '@sepraisal/common/index.ts'

import { IParseBlueprintSbc, IParseComponentSbc } from '../parsers/index.ts'

export interface IComponentDTO {
    health: number
    mass: number  // kg.
    maxIntegrity: number
    prerequisites: Record<string, number>

    size: {X: number, Y: number, Z: number}
    subtype: string
    time: number
    type: string
    volume: number  // l.
}

export class Component implements IComponentDTO {

    public static fromSbcs(
        blueprintSbcs: Map<string, IParseBlueprintSbc>,
        componentSbcs: Map<string, IParseComponentSbc>
    ): Component[] {
        const fullTypes = new Set(([] as Array<{fullType: string}>)
            .concat([...blueprintSbcs.values()].filter((sbc) => sbc.type === 'Component' && sbc.subtype !== 'ZoneChip'))
            .concat([...componentSbcs.values()].filter((sbc) => sbc.type === 'Component' && sbc.subtype !== 'ZoneChip'))
            .map((sbc) => sbc.fullType)
        )

        return [...fullTypes.values()]
            .map((fullType) => {
                const blueprintSbc = blueprintSbcs.get(fullType)
                if(!blueprintSbc) throw new Error(`Component "${fullType}" not found in "Blueprints.sbc".`)
                const componentSbc = componentSbcs.get(fullType)
                if(!componentSbc) throw new Error(`Component "${fullType}" not found in "Components.sbc".`)

                return {
                    ...blueprintSbc,
                    health: componentSbc.health,
                    maxIntegrity: componentSbc.maxIntegrity,
                    mass: componentSbc.mass,
                    size: componentSbc.size,
                    subtype: componentSbc.subtype,
                    type: componentSbc.type,
                    volume: componentSbc.volume,
                }
            })
            .map((dto) => new Component(dto, dto.mod))
    }


    public get title(): string { return `${this.type}/${this.subtype}`}

    public readonly health: number
    public readonly mass: number  // kg.
    public readonly maxIntegrity: number
    public readonly prerequisites: Record<string, number>
    public readonly size: {X: number, Y: number, Z: number}
    public readonly subtype: string
    public readonly time: number  // Seconds to build, baseBuildTime.
    public readonly type: string
    public readonly volume: number  // l.
    public readonly mod: VENDOR_MOD

    public constructor(dto: IComponentDTO, mod: VENDOR_MOD) {
        this.type = dto.type
        this.subtype = dto.subtype
        this.mass = dto.mass
        this.volume = dto.volume
        this.time = dto.time
        this.prerequisites = dto.prerequisites
        this.health = dto.health
        this.maxIntegrity = dto.maxIntegrity
        this.size = dto.size
        this.mod = mod
    }

    public toJSON(): IComponentDTO {
        return {
            health: this.health,
            mass: this.mass,
            maxIntegrity: this.maxIntegrity,
            prerequisites: this.prerequisites,
            size: this.size,
            subtype: this.subtype,
            time: this.time,
            type: this.type,
            volume: this.volume,
        }
    }

}
