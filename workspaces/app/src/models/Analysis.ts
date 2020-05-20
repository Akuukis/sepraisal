import { IBlueprint } from '@sepraisal/common'


export type BpProjectionAnalysis = Required<IBlueprint>

export class Analysis<T extends BpProjectionAnalysis = BpProjectionAnalysis> {
    public dto: T

    public constructor(dto: T) {
        this.dto = dto
    }

    public get id() { return this.dto.steam.id }
    public get title() { return this.dto.steam.title }
    public get postedDate() { return this.dto.steam.postedDate }
    public get authorTitle() { return this.dto.steam.authors[0].title }
    public get collections() { return this.dto.steam.collections }
    public get oreVolume() { return this.dto.sbc.oreVolume }
    public get blockPCU() { return this.dto.sbc.blockPCU }
    public get blockCount() { return this.dto.sbc.blockCount }
    public get thumb() { return this.dto.thumb.webp }
    public get gridSize() { return this.dto.sbc.gridSize === 'Large' ? 'L' : 'S' }
    public get time() { return Math.floor((this.dto.sbc.blockTime + this.dto.sbc.componentTime + this.dto.sbc.ingotTime) / 60) }
    public get flagsGreen() { return ([] as string[]).concat(this.dto.steam.flagsGreen).concat(this.dto.sbc.flagsGreen) }
    public get flagsYellow() { return ([] as string[]).concat(this.dto.steam.flagsYellow).concat(this.dto.sbc.flagsYellow) }
    public get flagsRed() { return ([] as string[]).concat(this.dto.steam.flagsRed).concat(this.dto.sbc.flagsRed) }

    public get subscriberCount() { return this.dto.steam.subscriberCount }

    public toJSON(): T {
        return this.dto
    }

}
