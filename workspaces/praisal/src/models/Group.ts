import { GroupTitle } from '@sepraisal/common'

import { CubeType } from '../xmlns/CubeType'
import { Block } from './Block'

export interface IGroupDTO {
    priority: number,
    title: string,
    types: string[],
}

export class Group {
    public readonly priority: number
    public readonly title: GroupTitle
    public readonly types: Set<RegExp>

    public constructor(dto: IGroupDTO) {
        this.priority = dto.priority
        this.title = dto.title as GroupTitle
        this.types = new Set(dto.types.map((type) => new RegExp(type)))
    }

    public match(blocks: Block[]): { matched: Block<CubeType>[]; other: Block<CubeType>[] } {
        const matched: Block[] = []
        const other: Block[] = []

        for(const block of blocks) {
            let found = false
            for(const regex of this.types.values()) {
                if(regex.test(block.title)) {
                    found = true
                    continue
                }
            }
            if(found) {
                matched.push(block)
            } else {
                other.push(block)
            }
        }

        return {matched, other}
    }

}
