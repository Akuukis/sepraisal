import { IBlueprint } from '@sepraisal/common'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid, Typography } from '@material-ui/core'
import { StyledComponentProps } from '@material-ui/core/styles'

import { ASYNC_STATE, createSmartFC, createStyles, IMyTheme, useAsyncEffectOnce } from '../../common/'
import { CONTEXT } from '../../stores'
import Header from './Header'
import SectionAutomation from './SectionAutomation'
import SectionBlocks from './SectionBlocks'
import SectionCosts from './SectionCosts'
import SectionDefensive from './SectionDefensive'
import SectionElectricity from './SectionElectricity'
import SectionIntegrity from './SectionIntegrity'
import SectionMaterials from './SectionMaterials'
import SectionMobility from './SectionMobility'
import SectionMods from './SectionMods'
import SectionOffensive from './SectionOffensive'
import SectionUtils from './SectionUtils'
import SectionWorkshop from './SectionWorkshop'
import MySection from './MySection'

const styles = (theme: IMyTheme) => createStyles({
    root: {
        maxWidth: theme.spacing(1) * 2 + 536,
        [theme.breakpoints.up('lg')]: {
            maxWidth: (theme.spacing(1) * 2 + 536) * 2,
        },
    },

    error: {
        backgroundColor: theme.palette.error.light,
    },
    item: {
        maxWidth: theme.spacing(1) * 2 + 536,
        padding: theme.spacing(1),
    },
    headerItem: {
        width: '100%',
    }
})


interface IProps {
    id: string | number
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {id} = props

    const blueprintStore = React.useContext(CONTEXT.BLUEPRINTS)
    const [status, setStatus] = React.useState<typeof ASYNC_STATE[keyof typeof ASYNC_STATE]>(ASYNC_STATE.Idle)
    const [blueprint, setBlueprint] = React.useState<IBlueprint | null>(null)


    useAsyncEffectOnce(async () => {
        setStatus(ASYNC_STATE.Doing)
        try {
            const cached = blueprintStore.getSomething(id)
            if(cached) {
                setBlueprint(cached)
                setStatus(ASYNC_STATE.Done)

                return
            }
        } catch(err) {
            console.info(err.message)
        }

        if(typeof id === 'string') {
            setStatus(ASYNC_STATE.Error)
            return
        }

        try {
            const doc = await blueprintStore.fetch(id)
            setBlueprint(doc)
            setStatus(ASYNC_STATE.Done)
        } catch(err) {
            setStatus(ASYNC_STATE.Error)
        }
    })

    if(status !== ASYNC_STATE.Done || !blueprint) {
        return (
            <Grid component='article' className={classes.root} container justify='center'>
                <Typography variant='body1' color='secondary'>TODO: nice loading animation..</Typography>
            </Grid>
        )
    }

    // @computed get anyError() {
    //     const { analysis } = props;
    //     return analysis.blocksErrors.length > 0
    //         || analysis.componentErrors.length > 0
    //         || analysis.ingotErrors.length > 0
    //         || analysis.oreErrors.length > 0
    // }

    const renderBox = (AnalysisSections: Section[], header = false) => (
        <Grid item className={classes.item} xs={12} style={header ? {maxWidth: '100%'} : {}}>
            {AnalysisSections.map((AnalysisSection, i) => (
                <MySection>
                    <AnalysisSection key={i} bp={blueprint} />
                </MySection>
            ))}
        </Grid>
    )

    return (
        <Grid component='article' className={classes.root} container justify='center'>
            {renderBox([Header          as Section], true)}
            {'steam' in blueprint ? renderBox([SectionWorkshop        as Section]) : null}
            {renderBox([SectionIntegrity       as Section])}
            {renderBox([SectionElectricity          as Section])}
            {renderBox([SectionUtils          as Section])}
            {renderBox([SectionCosts          as Section])}
            {renderBox([SectionMods          as Section])}
            {renderBox([SectionAutomation          as Section])}
            {renderBox([SectionMobility        as Section])}
            {renderBox([SectionOffensive        as Section])}
            {renderBox([SectionDefensive        as Section])}
            {renderBox([SectionMaterials          as Section])}
            {renderBox([SectionBlocks          as Section])}
        </Grid>
    )
})) /* ============================================================================================================= */


interface IBpProjection {
    _id?: number,                      // discover.ts
    classes?: Partial<IBlueprint.IClasses>,
    sbc?: Partial<IBlueprint.ISbc>,
    steam?: Partial<IBlueprint.ISteam>,
    thumb?: Partial<IBlueprint.IThumb>,
}

type Section = React.ComponentType<{bp: IBlueprint} & StyledComponentProps<'root'>>
