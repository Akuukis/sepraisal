import { BLOCK_GROUPS, VENDOR_MOD } from '@sepraisal/common'
import { PraisalManager } from '@sepraisal/praisal'
import CubeBlocksDecorative1Link from '@sepraisal/praisal/vendor/DecorativePack/CubeBlocks.sbc'
import CubeBlocksDecorative2Link from '@sepraisal/praisal/vendor/DecorativePack2/CubeBlocks.sbc'
import CubeBlocksEconomyLink from '@sepraisal/praisal/vendor/Economy/CubeBlocks.sbc'
import CubeBlocksFrostbiteLink from '@sepraisal/praisal/vendor/Frostbite/CubeBlocks.sbc'
import MaterialsLink from '@sepraisal/praisal/vendor/Vanilla/Blueprints.sbc'
import ComponentsLink from '@sepraisal/praisal/vendor/Vanilla/Components.sbc'
import CubeBlocksCubeBlocksLink from '@sepraisal/praisal/vendor/Vanilla/CubeBlocks/CubeBlocks.sbc'
import CubeBlocksArmorLink from '@sepraisal/praisal/vendor/Vanilla/CubeBlocks/CubeBlocks_Armor.sbc'
import CubeBlocksAutomationLink from '@sepraisal/praisal/vendor/Vanilla/CubeBlocks/CubeBlocks_Automation.sbc'
import CubeBlocksCommunicationsLink from '@sepraisal/praisal/vendor/Vanilla/CubeBlocks/CubeBlocks_Communications.sbc'
import CubeBlocksControlLink from '@sepraisal/praisal/vendor/Vanilla/CubeBlocks/CubeBlocks_Control.sbc'
import CubeBlocksDoorsLink from '@sepraisal/praisal/vendor/Vanilla/CubeBlocks/CubeBlocks_Doors.sbc'
import CubeBlocksEnergyLink from '@sepraisal/praisal/vendor/Vanilla/CubeBlocks/CubeBlocks_Energy.sbc'
import CubeBlocksExtrasLink from '@sepraisal/praisal/vendor/Vanilla/CubeBlocks/CubeBlocks_Extras.sbc'
import CubeBlocksGravityLink from '@sepraisal/praisal/vendor/Vanilla/CubeBlocks/CubeBlocks_Gravity.sbc'
import CubeBlocksInteriorsLink from '@sepraisal/praisal/vendor/Vanilla/CubeBlocks/CubeBlocks_Interiors.sbc'
import CubeBlocksLCDPanelsLink from '@sepraisal/praisal/vendor/Vanilla/CubeBlocks/CubeBlocks_LCDPanels.sbc'
import CubeBlocksLightsLink from '@sepraisal/praisal/vendor/Vanilla/CubeBlocks/CubeBlocks_Lights.sbc'
import CubeBlocksLogisticsLink from '@sepraisal/praisal/vendor/Vanilla/CubeBlocks/CubeBlocks_Logistics.sbc'
import CubeBlocksMechanicalLink from '@sepraisal/praisal/vendor/Vanilla/CubeBlocks/CubeBlocks_Mechanical.sbc'
import CubeBlocksMedicalLink from '@sepraisal/praisal/vendor/Vanilla/CubeBlocks/CubeBlocks_Medical.sbc'
import CubeBlocksProductionLink from '@sepraisal/praisal/vendor/Vanilla/CubeBlocks/CubeBlocks_Production.sbc'
import CubeBlocksThrustersLink from '@sepraisal/praisal/vendor/Vanilla/CubeBlocks/CubeBlocks_Thrusters.sbc'
import CubeBlocksToolsLink from '@sepraisal/praisal/vendor/Vanilla/CubeBlocks/CubeBlocks_Tools.sbc'
import CubeBlocksUtilityLink from '@sepraisal/praisal/vendor/Vanilla/CubeBlocks/CubeBlocks_Utility.sbc'
import CubeBlocksWeaponsLink from '@sepraisal/praisal/vendor/Vanilla/CubeBlocks/CubeBlocks_Weapons.sbc'
import CubeBlocksWheelsLink from '@sepraisal/praisal/vendor/Vanilla/CubeBlocks/CubeBlocks_Wheels.sbc'
import CubeBlocksWindowsLink from '@sepraisal/praisal/vendor/Vanilla/CubeBlocks/CubeBlocks_Windows.sbc'
import PhysicalItemsLink from '@sepraisal/praisal/vendor/Vanilla/PhysicalItems.sbc'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { ThemeProvider } from '@material-ui/styles'

import { createSmartFC, createStyles, IMyTheme, MY_LIGHT_THEME, useAsyncEffectOnce } from 'src/common'
import { CONTEXT } from 'src/stores'
import { BlueprintStore } from 'src/stores/BlueprintStore'
import { CardStore } from 'src/stores/CardStore'
import { FavoriteStore } from 'src/stores/FavoriteStore'
import { SelectionStore } from 'src/stores/SelectionStore'


const styles = (theme: IMyTheme) => createStyles({
    body: {
        margin: 0,
        overflowY: 'scroll',
    },
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const piwikStore = React.useContext(CONTEXT.PIWIK)
    const [favoriteStore] = React.useState(() => new FavoriteStore())
    const [blueprintStore] = React.useState(() => new BlueprintStore(favoriteStore))
    const [selectionStore] = React.useState(() => new SelectionStore())
    const [cardStore] = React.useState(() => new CardStore(piwikStore))
    const [praisalManager, setPraisalManager] = React.useState<PraisalManager | null>(null)

    React.useEffect(() => {
        const body = document.getElementById('body')!
        body.className = classes.body
    })

    useAsyncEffectOnce(async () => {
        try {
            const [componentsSbc, blueprintsSbc, physicalItemsSbc, ...cubeBlocksSbcsPairs] = await Promise.all([
                fetch(ComponentsLink).then((res) => res.text()),
                fetch(MaterialsLink).then((res) => res.text()),
                fetch(PhysicalItemsLink).then((res) => res.text()),

                fetch(CubeBlocksCubeBlocksLink      ).then(async (res) => [await res.text(), VENDOR_MOD.VANILLA]),
                fetch(CubeBlocksArmorLink           ).then(async (res) => [await res.text(), VENDOR_MOD.VANILLA]),
                fetch(CubeBlocksAutomationLink      ).then(async (res) => [await res.text(), VENDOR_MOD.VANILLA]),
                fetch(CubeBlocksCommunicationsLink  ).then(async (res) => [await res.text(), VENDOR_MOD.VANILLA]),
                fetch(CubeBlocksControlLink         ).then(async (res) => [await res.text(), VENDOR_MOD.VANILLA]),
                fetch(CubeBlocksDoorsLink           ).then(async (res) => [await res.text(), VENDOR_MOD.VANILLA]),
                fetch(CubeBlocksEnergyLink          ).then(async (res) => [await res.text(), VENDOR_MOD.VANILLA]),
                fetch(CubeBlocksExtrasLink          ).then(async (res) => [await res.text(), VENDOR_MOD.VANILLA]),
                fetch(CubeBlocksGravityLink         ).then(async (res) => [await res.text(), VENDOR_MOD.VANILLA]),
                fetch(CubeBlocksInteriorsLink       ).then(async (res) => [await res.text(), VENDOR_MOD.VANILLA]),
                fetch(CubeBlocksLCDPanelsLink       ).then(async (res) => [await res.text(), VENDOR_MOD.VANILLA]),
                fetch(CubeBlocksLightsLink          ).then(async (res) => [await res.text(), VENDOR_MOD.VANILLA]),
                fetch(CubeBlocksLogisticsLink       ).then(async (res) => [await res.text(), VENDOR_MOD.VANILLA]),
                fetch(CubeBlocksMechanicalLink      ).then(async (res) => [await res.text(), VENDOR_MOD.VANILLA]),
                fetch(CubeBlocksMedicalLink         ).then(async (res) => [await res.text(), VENDOR_MOD.VANILLA]),
                fetch(CubeBlocksProductionLink      ).then(async (res) => [await res.text(), VENDOR_MOD.VANILLA]),
                fetch(CubeBlocksThrustersLink       ).then(async (res) => [await res.text(), VENDOR_MOD.VANILLA]),
                fetch(CubeBlocksToolsLink           ).then(async (res) => [await res.text(), VENDOR_MOD.VANILLA]),
                fetch(CubeBlocksUtilityLink         ).then(async (res) => [await res.text(), VENDOR_MOD.VANILLA]),
                fetch(CubeBlocksWeaponsLink         ).then(async (res) => [await res.text(), VENDOR_MOD.VANILLA]),
                fetch(CubeBlocksWheelsLink          ).then(async (res) => [await res.text(), VENDOR_MOD.VANILLA]),
                fetch(CubeBlocksWindowsLink         ).then(async (res) => [await res.text(), VENDOR_MOD.VANILLA]),
                fetch(CubeBlocksDecorative1Link     ).then(async (res) => [await res.text(), VENDOR_MOD.DECORATIVE_1]),
                fetch(CubeBlocksDecorative2Link     ).then(async (res) => [await res.text(), VENDOR_MOD.DECORATIVE_2]),
                fetch(CubeBlocksEconomyLink         ).then(async (res) => [await res.text(), VENDOR_MOD.ECONOMY]),
                fetch(CubeBlocksFrostbiteLink       ).then(async (res) => [await res.text(), VENDOR_MOD.FROSTBITE]),
            ] as any) as [string, string, string, ...[string, VENDOR_MOD][]]
            const praisalManager = new PraisalManager()
            await praisalManager.addPhysicalItemsSbc(physicalItemsSbc, VENDOR_MOD.VANILLA)
            await praisalManager.addBlueprintsSbc(blueprintsSbc, VENDOR_MOD.VANILLA)
            await praisalManager.addComponentsSbc(componentsSbc, VENDOR_MOD.VANILLA)
            for(const [cubeBlocksSbc, mod] of cubeBlocksSbcsPairs) {
                console.log(mod, cubeBlocksSbc.slice(0, 100))
                await praisalManager.addCubeBlocksSbc(cubeBlocksSbc, mod)
            }
            praisalManager.addGroups(BLOCK_GROUPS)
            setPraisalManager(praisalManager)
        } catch(err) {
            console.error(err)
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
