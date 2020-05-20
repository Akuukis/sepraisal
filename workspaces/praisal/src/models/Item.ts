import { parseBlueprintSbc, parsePhysicalItemsSbc } from '../parsers'

export interface IItemDTO {
    mass: number  // kg.
    prerequisites: Record<string, number>
    subtype: string
    time: number
    type: string
    volume: number  // l.
}

export class Item implements IItemDTO {
    /**
     * TODO: Probably need to have seperate models but this is a quickfix.
     */
    public static readonly ITEM_TYPES: ['OxygenContainerObject', 'GasContainerObject', 'PhysicalGunObject', 'AmmoMagazine']

    /**
     * BROKEN. TODO: Fix.
     */
    public static async parseSbc(physicalItemsSbc: string, blueprintsSbc: string): Promise<Item[]> {
        const itemDtos1 = await parseBlueprintSbc(blueprintsSbc/* , Item.ITEM_TYPES */)
        const itemDtos2 = await parsePhysicalItemsSbc(physicalItemsSbc/* , 'Ingot' */)

        return itemDtos2
            .filter((itemDto2) => itemDto2.subtype !== 'Scrap')
            .map((itemDto2) => {
                const itemDto1 = itemDtos1.find((inner) => inner.subtype === itemDto2.subtype)
                if(!itemDto1) throw new Error('Item not found in "Blueprint.sbc".')

                return {
                    ...itemDto1,
                    ...itemDto2,
                }
            })
            .map((itemDto) => new Item(itemDto))
    }

    public readonly mass: number  // kg.


    public get title() { return `${this.type}/${this.subtype}`}

    public readonly prerequisites: Record<string, number>
    public readonly subtype: string
    public readonly time: number  // Seconds to build, baseBuildTime.
    public readonly type: string
    public readonly volume: number  // l.

    public constructor(dto: IItemDTO) {
        this.type = dto.type
        this.subtype = dto.subtype
        this.mass = dto.mass
        this.volume = dto.volume
        this.time = dto.time
        this.prerequisites = dto.prerequisites
    }

    public toJSON(): IItemDTO {
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
