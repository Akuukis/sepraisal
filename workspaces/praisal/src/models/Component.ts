import { parseBlueprintSbc, parseComponentSbc } from '../parsers'

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


    public static async parseXml(materialXml: string, componentXml: string): Promise<Component[]> {
        const componentDtos = await parseBlueprintSbc(materialXml, ['Component'])
        const componentMap = new Map(componentDtos.map<[string, Partial<IComponentDTO>]>((val) => [val.subtype, val]))

        const comp2s = await parseComponentSbc(componentXml)
        comp2s.forEach((comp2) => {
            const comp = componentMap.get(comp2.subtype)
            if(!comp) throw new Error(`Component ${comp2.subtype} not found.`)

            comp.health = comp2.health
            comp.maxIntegrity = comp2.maxIntegrity
            comp.mass = comp2.mass
            comp.size = comp2.size
            comp.subtype = comp2.subtype
            comp.type = comp2.type
            comp.volume = comp2.volume
        })

        return ([...componentMap.values()] as IComponentDTO[]).map((blockDto) => new Component(blockDto))
    }


    public get title() { return `${this.type}/${this.subtype}`}

    public readonly health: number
    public readonly mass: number  // kg.
    public readonly maxIntegrity: number
    public readonly prerequisites: Record<string, number>
    public readonly size: {X: number, Y: number, Z: number}
    public readonly subtype: string
    public readonly time: number  // Seconds to build, baseBuildTime.
    public readonly type: string
    public readonly volume: number  // l.

    public constructor(dto: IComponentDTO) {
        this.type = dto.type
        this.subtype = dto.subtype
        this.mass = dto.mass
        this.volume = dto.volume
        this.time = dto.time
        this.prerequisites = dto.prerequisites
        this.health = dto.health
        this.maxIntegrity = dto.maxIntegrity
        this.size = dto.size
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
