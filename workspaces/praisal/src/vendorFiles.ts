import { VENDOR_MOD } from '@sepraisal/common'

import { readdirSync } from 'fs'
import { join } from 'path'

export const VENDOR_DIR = join(__dirname, '..', 'vendor')

export const getVanillaCubeBlocksPaths = (): string[] => {
    const vanillaCubeBlocksDir = join(VENDOR_DIR, VENDOR_MOD.VANILLA, 'CubeBlocks')

    return readdirSync(vanillaCubeBlocksDir)
        .filter((filename) => filename.startsWith('CubeBlocks') && filename.endsWith('.sbc'))
        .sort()
        .map((filename) => join(vanillaCubeBlocksDir, filename))
}
