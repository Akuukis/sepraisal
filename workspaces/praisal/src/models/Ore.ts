import { parsePhysicalItemsSbc } from '../parsers'


export interface IOreDTO {
    mass: number
    subtype: string
    type: string
    volume: number
}

export class Ore implements IOreDTO {

    public static async parseXml(physicalItemsXml: string): Promise<Ore[]> {
        const oreDtos = await parsePhysicalItemsSbc(physicalItemsXml, 'Ore')

        return oreDtos.map((blockDto) => new Ore(blockDto))
    }


    public get title() { return `${this.type}/${this.subtype}`}
    public readonly mass: number  // kg.
    public readonly subtype: string
    public readonly type: string
    public readonly volume: number  // l.

    public constructor(dto: IOreDTO) {
        this.type = dto.type
        this.subtype = dto.subtype
        this.mass = dto.mass
        this.volume = dto.volume
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
