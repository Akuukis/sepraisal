import { parseBlueprintSbc, parsePhysicalItemsSbc } from '../parsers'

export interface IIngotDTO {
    mass: number  // kg.
    prerequisites: Record<string, number>
    subtype: string
    time: number
    type: string
    volume: number  // l.
}

export class Ingot implements IIngotDTO {

    public static async parseSbc(physicalItemsSbc: string, blueprintsSbc: string): Promise<Ingot[]> {
        const ingotDtos1 = await parseBlueprintSbc(blueprintsSbc, ['Ingot'])
        const ingotDtos2 = await parsePhysicalItemsSbc(physicalItemsSbc, 'Ingot')

        return ingotDtos2
            .filter((ingotDto2) => ingotDto2.subtype !== 'Scrap')
            .map((ingotDto2) => {
                const ingotDto1 = ingotDtos1.find((inner) => inner.subtype === ingotDto2.subtype)
                if(!ingotDto1) throw new Error('Ingot not found in "Blueprint.sbc".')

                return {
                    ...ingotDto1,
                    ...ingotDto2,
                }
            })
            .map((ingotDto) => new Ingot(ingotDto))
    }

    public readonly mass: number  // kg.


    public get title() { return `${this.type}/${this.subtype}`}

    public readonly prerequisites: Record<string, number>
    public readonly subtype: string
    public readonly time: number  // Seconds to build, baseBuildTime.
    public readonly type: string
    public readonly volume: number  // l.

    public constructor(dto: IIngotDTO) {
        this.type = dto.type
        this.subtype = dto.subtype
        this.mass = dto.mass
        this.volume = dto.volume
        this.time = dto.time
        this.prerequisites = dto.prerequisites
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
