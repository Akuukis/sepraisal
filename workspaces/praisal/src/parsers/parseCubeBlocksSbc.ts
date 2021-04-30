import { VENDOR_MOD } from '@sepraisal/common/src'
import { parse } from 'fast-xml-parser'

import { CubeDTO, ICubeDefinition } from '../xmlns/CubeDefinition'
import { PARSE_CONFIG } from './common'


export type IParseCubeBlocksSbc = CubeDTO & {mod: VENDOR_MOD}


export const parseCubeBlocksSbc = async (xml: string, mod: VENDOR_MOD): Promise<CubeDTO[]> =>
    new Promise((resolve: (value: CubeDTO[]) => void, reject: (reason: Error) => void) => {
        try {
            const bp: ICubeDefinition = parse(xml, PARSE_CONFIG, true)
            resolve(bp.Definitions[0].CubeBlocks[0].Definition
                .filter((cubeDto) => cubeDto.Id['0'].SubtypeId['0'] !== 'DeadAstronaut')
                .map((cubeDto) => ({...cubeDto, mod}))
            )
        } catch(err) {
            reject(err as Error)
        }
    })
