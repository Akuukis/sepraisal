import { IBlueprint } from '@sepraisal/common'
import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid, GridProps, Typography } from '@material-ui/core'
import { StyledComponentProps } from '@material-ui/core/styles'

import { ASYNC_STATE, createSmartFC, createStyles, IMyTheme, useAsyncEffectOnce } from '../../common/'
import { CONTEXT } from '../../stores'
import Header from './Header'
import MySectionErrorBoundary from './MySectionErrorBoundary'
import SectionAutomation from './SectionAutomation'
import SectionBlocks from './SectionBlocks'
import SectionCargo from './SectionCargo'
import SectionCosts from './SectionCosts'
import SectionDefensive from './SectionDefensive'
import SectionDescription from './SectionDescription'
import SectionElectricity from './SectionElectricity'
import SectionIntegrity from './SectionIntegrity'
import SectionMaterials from './SectionMaterials'
import SectionMobility from './SectionMobility'
import SectionMods from './SectionMods'
import SectionOffensive from './SectionOffensive'
import SectionPrintable from './SectionPrintable'
import SectionUtils from './SectionUtils'
import SectionWorkshop from './SectionWorkshop'

const styles = (theme: IMyTheme) => createStyles({
    root: {
        maxWidth: (theme.spacing(1) * 2 + theme.shape.boxWidth * 2) * 1,
    },
    rootLg: {
        [theme.breakpoints.up('lg')]: {
            maxWidth: (theme.spacing(1) * 2 + theme.shape.boxWidth * 2) * 2,
        },
    },
    rootXl: {
        [theme.breakpoints.up('xl')]: {
            maxWidth: (theme.spacing(1) * 2 + theme.shape.boxWidth * 2) * 3,
        },
    },

    narrow: {
        maxWidth: (theme.spacing(1) * 2 + theme.shape.boxWidth * 2) * 0.5,
    },

    error: {
        backgroundColor: theme.palette.error.light,
    },
    item: {
        maxWidth: theme.spacing(1) * 2 + theme.shape.boxWidth * 2,
        padding: theme.spacing(1),
    },
    headerItem: {
        width: '100%',
    }
})


interface IProps extends GridProps {
    bpId: string | number
    long?: boolean
    maxWidth?: 0.5 | 1 | 2 | 3
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {bpId, long, maxWidth, className, ...otherProps} = props

    const blueprintStore = React.useContext(CONTEXT.BLUEPRINTS)
    const [status, setStatus] = React.useState<typeof ASYNC_STATE[keyof typeof ASYNC_STATE]>(ASYNC_STATE.Idle)
    const [blueprint, setBlueprint] = React.useState<IBlueprint | null>(null)

    const rootClassName = clsx(classes.root, {
            [classes.narrow]: maxWidth === 0.5,
            [classes.rootLg]: !maxWidth || maxWidth >= 2,
            [classes.rootXl]: !maxWidth || maxWidth >= 3,
        }, className)

    useAsyncEffectOnce(async () => {
        setStatus(ASYNC_STATE.Doing)
        const cached = blueprintStore.getSomething(bpId)
        if(cached) {
            setBlueprint(cached)
            setStatus(ASYNC_STATE.Done)

            return
        }

        if(typeof bpId === 'string') {
            setStatus(ASYNC_STATE.Error)
            return
        }

        try {
            const doc = await blueprintStore.fetch(bpId)
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

    let sectionGroupCounter = 0
    const sectionGroup = (AnalysisSections: [string, Section][], header = false) => (
        <Grid item className={classes.item} xs={12} key={sectionGroupCounter++} style={header ? {maxWidth: '100%'} : {}}>
            {AnalysisSections.map(([heading, AnalysisSection], i) => (
                <MySectionErrorBoundary key={i} heading={heading}>
                    <AnalysisSection bp={blueprint} long={long} narrow={maxWidth === 0.5} />
                </MySectionErrorBoundary>
            ))}
        </Grid>
    )

    return (
        <Grid
            id={bpId as string}
            component='article'
            className={rootClassName}

            container
            alignItems='flex-start'
            justify='flex-end'
            {...otherProps}
        >
            <Grid
                item
                xs={12}
                xl={(!maxWidth || maxWidth >=3) ? 4 : 12}

                container
            >
                {sectionGroup([['Header', Header as Section]], true)}
                {'steam' in blueprint ? sectionGroup([['Workshop', SectionWorkshop as Section]]) : null}
                {'steam' in blueprint ? sectionGroup([['Description', SectionDescription as Section]]) : null}
            </Grid>
            <Grid
                item
                xs={12}
                xl={(!maxWidth || maxWidth >=3) ? 8 : 12}

                container
            >
                {sectionGroup([['Integrity', SectionIntegrity as Section]])}
                {sectionGroup([['Mods', SectionMods as Section]])}
                {sectionGroup([['Offensive', SectionOffensive as Section],
                               ['Defensive', SectionDefensive as Section]])}
                {sectionGroup([['Cargo', SectionCargo as Section]])}
                {sectionGroup([['Mobility', SectionMobility as Section]])}
                {sectionGroup([['Printable', SectionPrintable as Section],
                               ['Costs', SectionCosts as Section]])}
                {sectionGroup([['Utils', SectionUtils as Section]])}
                {sectionGroup([['Electricity', SectionElectricity as Section],
                               ['Automation', SectionAutomation as Section]])}
                {sectionGroup([['Materials', SectionMaterials as Section]])}
                {sectionGroup([['Blocks', SectionBlocks as Section]])}
            </Grid>
        </Grid>
    )
})) /* ============================================================================================================= */

type Section = React.ComponentType<{bp: IBlueprint, long?: boolean, narrow?: boolean} & StyledComponentProps<'root'>>
