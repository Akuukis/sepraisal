import { VENDOR_MOD } from '@sepraisal/common/src'
import { parseString } from 'xml2js'

import { CubeDTO, ICubeDefinition } from '../xmlns/CubeDefinition'


export type IParseCubeBlocksSbc = CubeDTO & {mod: VENDOR_MOD}


export const parseCubeBlocksSbc = async (xml: string, mod: VENDOR_MOD): Promise<CubeDTO[]> =>
    new Promise((resolve: (value: CubeDTO[]) => void, reject: (reason: Error) => void) => {
        parseString(xml, (parseError, bp: ICubeDefinition) => {
            if(parseError) reject(parseError)
            try {
                resolve(bp.Definitions.CubeBlocks[0].Definition
                    .filter((cubeDto) => cubeDto.Id['0'].SubtypeId['0'] !== 'DeadAstronaut')
                    .map((cubeDto) => ({...cubeDto, mod}))
                )
            } catch(err) {
                reject(err as Error)
            }
        })
    })
