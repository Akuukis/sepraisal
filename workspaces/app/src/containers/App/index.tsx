import { BLOCK_GROUPS, VENDOR_MOD } from '@sepraisal/common'
import { PraisalManager } from '@sepraisal/praisal'
import CubeBlocksDecorative1Link from '@sepraisal/praisal/vendor/DecorativePack/CubeBlocks.sbc'
import CubeBlocksDecorative2Link from '@sepraisal/praisal/vendor/DecorativePack2/CubeBlocks.sbc'
import CubeBlocksEconomyLink from '@sepraisal/praisal/vendor/Economy/CubeBlocks.sbc'
import CubeBlocksFrostbiteLink from '@sepraisal/praisal/vendor/Frostbite/CubeBlocks.sbc'
import CubeBlocksIndustrialPackLink from '@sepraisal/praisal/vendor/IndustrialPack/CubeBlocks.sbc'
import CubeBlocksScrapRacePackLink from '@sepraisal/praisal/vendor/ScrapRacePack/CubeBlocks.sbc'
import CubeBlocksSparksOfTheFutureLink from '@sepraisal/praisal/vendor/SparksOfTheFuturePack/CubeBlocks.sbc'
import CubeBlocksWarfare1Link from '@sepraisal/praisal/vendor/Warfare1/CubeBlocks.sbc'
import CubeBlocksWarfare2Link from '@sepraisal/praisal/vendor/Warfare2/CubeBlocks.sbc'
import MaterialsLink from '@sepraisal/praisal/vendor/Vanilla/Blueprints.sbc'
import ComponentsLink from '@sepraisal/praisal/vendor/Vanilla/Components.sbc'
import PhysicalItemsLink from '@sepraisal/praisal/vendor/Vanilla/PhysicalItems.sbc'
import CubeBlocksGridAIPackLink from '@sepraisal/praisal/vendor/GridAIPack/CubeBlocks.sbc'
import CubeBlocksDecorative3Link from '@sepraisal/praisal/vendor/DecorativePack3/CubeBlocks.sbc'
import CubeBlocksSignalsPackLink from '@sepraisal/praisal/vendor/SignalsPack/CubeBlocks.sbc'
import CubeBlocksContactPackLink from '@sepraisal/praisal/vendor/ContactPack/CubeBlocks.sbc'
import CubeBlocksFieldworkLink from '@sepraisal/praisal/vendor/Fieldwork/CubeBlocks.sbc'
import CubeBlocksApexSurvivalPackLink from '@sepraisal/praisal/vendor/ApexSurvivalPack/CubeBlocks.sbc'
import CubeBlocksCoreSystemsPackLink from '@sepraisal/praisal/vendor/CoreSystemsPack/CubeBlocks.sbc'
import CubeBlocksEconomy2PackLink from '@sepraisal/praisal/vendor/Economy2Pack/CubeBlocks.sbc'
import CubeBlocksProsperityPackLink from '@sepraisal/praisal/vendor/ProsperityPack/CubeBlocks.sbc'


import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { ThemeProvider } from '@material-ui/styles'

import { createSmartFC, createStyles, IMyTheme, MY_LIGHT_THEME, useAsyncEffectOnce } from 'src/common'
import { CONTEXT } from 'src/stores'
import { BlueprintStore } from 'src/stores/BlueprintStore'
import { CardStore } from 'src/stores/CardStore'
import { FavoriteStore } from 'src/stores/FavoriteStore'
import { SelectionStore } from 'src/stores/SelectionStore'


const vanillaCubeBlocksContext = require.context('@sepraisal/praisal/vendor/Vanilla/CubeBlocks', false, /^\.\/CubeBlocks.*\.sbc$/)
const vanillaCubeBlocksLinks = vanillaCubeBlocksContext.keys()
    .sort()
    .map((key) => {
        const module = vanillaCubeBlocksContext(key) as string | { default: string }
        return typeof module === 'string' ? module : module.default
    })


const styles = (theme: IMyTheme) => createStyles({
    body: {
        margin: 0,
        overflowY: 'scroll',
    },
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const analyticsStore = React.useContext(CONTEXT.ANALYTICS)
    const [favoriteStore] = React.useState(() => new FavoriteStore(analyticsStore))
    const [blueprintStore] = React.useState(() => new BlueprintStore(favoriteStore))
    const [selectionStore] = React.useState(() => new SelectionStore())
    const [cardStore] = React.useState(() => new CardStore(analyticsStore))
    const [praisalManager, setPraisalManager] = React.useState<PraisalManager | null>(null)

    React.useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const body = document.getElementById('body')!
        body.className = classes.body
    })

    useAsyncEffectOnce(async () => {
        try {
            const [componentsSbc, blueprintsSbc, physicalItemsSbc, ...cubeBlocksSbcsPairs] = await Promise.all([
                fetch(ComponentsLink).then((res) => res.text()),
                fetch(MaterialsLink).then((res) => res.text()),
                fetch(PhysicalItemsLink).then((res) => res.text()),
                ...vanillaCubeBlocksLinks.map((link) => fetch(link).then(async (res) => [await res.text(), VENDOR_MOD.VANILLA] as [string, VENDOR_MOD])),
                fetch(CubeBlocksDecorative1Link         ).then(async (res) => [await res.text(), VENDOR_MOD.DECORATIVE_1]),
                fetch(CubeBlocksDecorative2Link         ).then(async (res) => [await res.text(), VENDOR_MOD.DECORATIVE_2]),
                fetch(CubeBlocksEconomyLink             ).then(async (res) => [await res.text(), VENDOR_MOD.ECONOMY]),
                fetch(CubeBlocksFrostbiteLink           ).then(async (res) => [await res.text(), VENDOR_MOD.FROSTBITE]),
                fetch(CubeBlocksSparksOfTheFutureLink   ).then(async (res) => [await res.text(), VENDOR_MOD.SPARKSOFTHEFUTURE]),
                fetch(CubeBlocksScrapRacePackLink       ).then(async (res) => [await res.text(), VENDOR_MOD.SCRAPRACEPACK]),
                fetch(CubeBlocksWarfare1Link            ).then(async (res) => [await res.text(), VENDOR_MOD.WARFARE_1]),
                fetch(CubeBlocksIndustrialPackLink      ).then(async (res) => [await res.text(), VENDOR_MOD.INDUSTRIAL]),
                fetch(CubeBlocksWarfare2Link            ).then(async (res) => [await res.text(), VENDOR_MOD.WARFARE_2]), //this line wasn't added in the SEPraisal update for warfare 2 lol
                fetch(CubeBlocksGridAIPackLink          ).then(async (res) => [await res.text(), VENDOR_MOD.GRIDAIPACK]),
                fetch(CubeBlocksDecorative3Link         ).then(async (res) => [await res.text(), VENDOR_MOD.DECORATIVE_3]),
                fetch(CubeBlocksSignalsPackLink         ).then(async (res) => [await res.text(), VENDOR_MOD.SIGNALS]),
                fetch(CubeBlocksContactPackLink         ).then(async (res) => [await res.text(), VENDOR_MOD.CONTACT]),
                fetch(CubeBlocksFieldworkLink           ).then(async (res) => [await res.text(), VENDOR_MOD.FIELDWORK]),
                fetch(CubeBlocksApexSurvivalPackLink    ).then(async (res) => [await res.text(), VENDOR_MOD.APEXSURVIVALPACK]),
                fetch(CubeBlocksCoreSystemsPackLink     ).then(async (res) => [await res.text(), VENDOR_MOD.CORESYSTEMSPACK]),
                fetch(CubeBlocksEconomy2PackLink        ).then(async (res) => [await res.text(), VENDOR_MOD.ECONOMY2PACK]),
                fetch(CubeBlocksProsperityPackLink      ).then(async (res) => [await res.text(), VENDOR_MOD.PROSPERITYPACK]),
            ] as never) as [string, string, string, ...[string, VENDOR_MOD][]]
            const praisalManager = new PraisalManager()
            await praisalManager.addPhysicalItemsSbc(physicalItemsSbc, VENDOR_MOD.VANILLA)
            await praisalManager.addBlueprintsSbc(blueprintsSbc, VENDOR_MOD.VANILLA)
            await praisalManager.addComponentsSbc(componentsSbc, VENDOR_MOD.VANILLA)
            for(const [cubeBlocksSbc, mod] of cubeBlocksSbcsPairs) {
                await praisalManager.addCubeBlocksSbc(cubeBlocksSbc, mod)
            }
            // praisalManager.addGroups(BLOCK_GROUPS)
            praisalManager.build()
            setPraisalManager(praisalManager)
            console.info('Praisal Manager initialized, now it\'s ready to praise uploads.')
        } catch(err) {
            console.error('Failed to initialise Praisal Manager', err)
        }
    })


    return (
        <CONTEXT.BLUEPRINTS.Provider value={blueprintStore}>
            <CONTEXT.FAVORITES.Provider value={favoriteStore}>
                <CONTEXT.CARDS.Provider value={cardStore}>
                    <CONTEXT.PRAISAL_MANAGER.Provider value={praisalManager}>
                        <CONTEXT.SELECTION.Provider value={selectionStore}>

                            <ThemeProvider theme={MY_LIGHT_THEME}>
                                {children}
                            </ThemeProvider>

                        </CONTEXT.SELECTION.Provider>
                    </CONTEXT.PRAISAL_MANAGER.Provider>
                </CONTEXT.CARDS.Provider>
            </CONTEXT.FAVORITES.Provider>
        </CONTEXT.BLUEPRINTS.Provider>
    )
})) /* ============================================================================================================= */
