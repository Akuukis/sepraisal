import { BLOCK_GROUPS } from '@sepraisal/common'
import { PraisalManager } from '@sepraisal/praisal'
import MaterialsLink from '@sepraisal/praisal/vendor/Blueprints.sbc'
import ComponentsLink from '@sepraisal/praisal/vendor/Components.sbc'
import CubeBlocksLink from '@sepraisal/praisal/vendor/CubeBlocks.sbc'
import PhysicalItemsLink from '@sepraisal/praisal/vendor/PhysicalItems.sbc'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Paper } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles'

import { ASYNC_STATE, MY_LIGHT_THEME, useAsyncEffectOnce, SE_COLORS } from '../../common'
import { createSmartFC, createStyles, IMyTheme } from '../../common/'
import { CONTEXT } from '../../stores'
import { BlueprintStore } from '../../stores/BlueprintStore'
import { CardStore } from '../../stores/CardStore'
import Topbar from './Topbar'


const styles = (theme: IMyTheme) => createStyles({
    app: {
        '@media (min-width: 0px)': {
            top: 56,
        },
        '@media (min-width: 600px)': {
            top: 64,
        },
        background: '#f0f0f0',
        fontFamily: '"Roboto", Helvetica, Arial, sans-serif',
        fontSmoothing: 'antialiased',
        fontWeight: 300,
        height: '100%',
        left: 0,
        minWidth: '230px',
        overflow: 'hidden',
        position: 'fixed',
        width: '100%',
    },
    content: {
        '@media (min-width: 0px)': {
            height: 'calc(100% - 56px)',
        },
        '@media (min-width: 600px)': {
            height: 'calc(100% - 64px)',
        },
        backgroundColor: SE_COLORS.grey,
        overflowX: 'hidden',
        overflowY: 'visible',
    },
})


interface IProps {
}


export default hot(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {
    const [blueprintStore] = React.useState(() => new BlueprintStore())
    const [cardStore] = React.useState(() => new CardStore())
    const [praisalManager] = React.useState(() => new PraisalManager())
    const [state, setState] = React.useState<ASYNC_STATE>(ASYNC_STATE.Idle)

    useAsyncEffectOnce(async () => {
        try {
            setState(ASYNC_STATE.Doing)
            const [componentsXml, materialsXml, physicalItemsXml, cubeBlocksXml] = await Promise.all([
                fetch(ComponentsLink).then((res) => res.text()),
                fetch(MaterialsLink).then((res) => res.text()),
                fetch(PhysicalItemsLink).then((res) => res.text()),
                fetch(CubeBlocksLink).then((res) => res.text()),
            ])
            await praisalManager.addOres(physicalItemsXml)
            await praisalManager.addIngots(physicalItemsXml, materialsXml)
            await praisalManager.addComponents(materialsXml, componentsXml)
            await praisalManager.addCubes(cubeBlocksXml)
            praisalManager.addGroups(BLOCK_GROUPS)
            setState(ASYNC_STATE.Done)
        } catch(err) {
            console.error(err)
            setState(ASYNC_STATE.Error)
        }

    })

    if(state === ASYNC_STATE.Idle || state === ASYNC_STATE.Doing) {
        return (
            <ThemeProvider theme={MY_LIGHT_THEME}>
                <Paper className={classes.app} square>
                    <Topbar/>
                    <Paper>
                        Loading...
                    </Paper>
                </Paper>
            </ThemeProvider>
        )
    }

    if(state === ASYNC_STATE.Error) {
        return (
            <ThemeProvider theme={MY_LIGHT_THEME}>
                <Paper className={classes.app} square>
                    <Topbar/>
                    <Paper>
                        Error at startup. Please try again or see console for details.
                    </Paper>
                </Paper>
            </ThemeProvider>
        )
    }

    return (
        <CONTEXT.BLUEPRINTS.Provider value={blueprintStore}>
        <CONTEXT.CARDS.Provider value={cardStore}>
        <CONTEXT.PRAISAL_MANAGER.Provider value={praisalManager}>

        <ThemeProvider theme={MY_LIGHT_THEME}>
            <Paper className={classes.app} square>
                <Topbar/>
                <Paper className={classes.content} square>
                    {children}
                </Paper>
            </Paper>
        </ThemeProvider>

        </CONTEXT.PRAISAL_MANAGER.Provider>
        </CONTEXT.CARDS.Provider>
        </CONTEXT.BLUEPRINTS.Provider>
    )
})) /* ============================================================================================================= */
