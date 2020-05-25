import { IBlueprint } from '@sepraisal/common'
import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid, GridProps, useMediaQuery } from '@material-ui/core'
import { StyledComponentProps } from '@material-ui/core/styles'

import { ASYNC_STATE, createSmartFC, createStyles, IMyTheme, useAsyncEffectOnce } from 'src/common'
import { CONTEXT } from 'src/stores'

import FavoriteButton from '../FavoriteButton'
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
import SectionPlaceholder from './SectionPlaceholder'
import SectionPrintable from './SectionPrintable'
import SectionThumbNarrow from './SectionThumbNarrow'
import SectionUtils from './SectionUtils'
import SectionWorkshop from './SectionWorkshop'

const styles = (theme: IMyTheme) => createStyles({
    root: {
        maxWidth: theme.spacing(1) * 2 + theme.shape.boxWidth * 2 * 1,
        minWidth: theme.spacing(1) * 2 + theme.shape.boxWidth * 2 * 1,
        [theme.breakpoints.down('xs')]: {
            maxWidth: theme.spacing(1) * 4 + theme.shape.boxWidth * 2 * 1,
            minWidth: theme.spacing(1) * 4 + theme.shape.boxWidth * 2 * 0.5,
        },
    },
    rootLg: {
        [theme.breakpoints.up('lg')]: {
            maxWidth: theme.spacing(1) * 4 + theme.shape.boxWidth * 2 * 2,
            minWidth: theme.spacing(1) * 4 + theme.shape.boxWidth * 2 * 2,
        },
    },
    rootXl: {
        [theme.breakpoints.up('xl')]: {
            maxWidth: theme.spacing(1) * 6 + theme.shape.boxWidth * 2 * 3,
            minWidth: theme.spacing(1) * 6 + theme.shape.boxWidth * 2 * 3,
        },
    },

    narrow: {
        maxWidth: theme.spacing(1) * 2 + theme.shape.boxWidth * 2 * 0.5,
        minWidth: theme.spacing(1) * 2 + theme.shape.boxWidth * 2 * 0.5,
    },

    error: {
        backgroundColor: theme.palette.error.light,
    },
    item: {
        maxWidth: theme.spacing(2) + theme.shape.boxWidth * 2,
        padding: theme.spacing(0, 1),
        overflow: 'hidden',
    },
    headerItem: {
        width: '100%',
    },
})


interface IProps extends GridProps {
    bpId: string | number
    long?: boolean
    maxWidth?: 0.5 | 1 | 2 | 3
    icons?: React.ReactNode
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {bpId, icons, long, maxWidth, className, ...otherProps} = props

    const praisalManager = React.useContext(CONTEXT.PRAISAL_MANAGER)
    const blueprintStore = React.useContext(CONTEXT.BLUEPRINTS)
    const cached = blueprintStore.getSomething(bpId)

    const [state, setState] = React.useState<{code: ASYNC_STATE, text?: string}>({code: cached ? ASYNC_STATE.Done : ASYNC_STATE.Idle})
    const [blueprint, setBlueprint] = React.useState<IBlueprint | null>(() => cached ?? null)

    const rootClassName = clsx(classes.root, {
            [classes.narrow]: maxWidth === 0.5,
            [classes.rootLg]: !maxWidth || maxWidth >= 2,
            [classes.rootXl]: !maxWidth || maxWidth >= 3,
        }, className)

    useAsyncEffectOnce(async () => {
        if(state.code === ASYNC_STATE.Done) return

        if(typeof bpId === 'string') {
            setState({code: ASYNC_STATE.Error})
            return
        }

        try {
            setState({code: ASYNC_STATE.Doing})
            const doc = await blueprintStore.fetch(bpId)
            setBlueprint(doc)
            setState({code: ASYNC_STATE.Done})
        } catch(err) {
            setState({code: ASYNC_STATE.Error, text: err.message})
        }
    })

    let sectionGroupCounter = 1
    const sectionGroup = (AnalysisSections: [string, Section][], header = false) => (
        <Grid item className={classes.item} xs={12} key={sectionGroupCounter++} style={header ? {maxWidth: '100%'} : {}}>
            {AnalysisSections.map(([heading, AnalysisSection], i) => {
                if(state.code === ASYNC_STATE.Done && !!praisalManager && !!blueprint) {
                    return (
                        <MySectionErrorBoundary key={i} heading={heading}>
                            <AnalysisSection bp={blueprint} long={long} narrow={maxWidth === 0.5} />
                        </MySectionErrorBoundary>
                    )
                } else {
                    return (
                        <MySectionErrorBoundary key={i} heading={heading}>
                            <SectionPlaceholder long={AnalysisSections.length === 1} narrow={maxWidth === 0.5} />
                        </MySectionErrorBoundary>
                    )
                }
            })}
        </Grid>
    )

    const smUp = useMediaQuery(theme.breakpoints.up('sm'), { noSsr: true })
    const hideThumb = smUp && maxWidth !== 0.5

    return (
        <Grid
            id={String(bpId)}
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
                <Grid item className={classes.item} xs={12} style={{maxWidth: '100%'}}>
                    <Header bpId={bpId} blueprint={blueprint} state={!praisalManager ? {code: ASYNC_STATE.Doing} : state}>
                        {blueprint && <FavoriteButton bpId={blueprint._id!} name={blueprint?.steam?.title || blueprint?.sbc?.gridTitle || '?'} />}
                        {icons}
                    </Header>
                </Grid>
                {(!blueprint || blueprint?.steam) && !hideThumb ? sectionGroup([['Thumb', SectionThumbNarrow as Section]]) : null}
                {(!blueprint || blueprint?.steam) ? sectionGroup([['Workshop', SectionWorkshop as Section]]) : null}
                {(!blueprint || blueprint?.steam) ? sectionGroup([['Description', SectionDescription as Section]]) : null}
            </Grid>
            <Grid
                item
                xs={12}
                xl={(!maxWidth || maxWidth >=3) ? 8 : 12}

                container
            >
                {sectionGroup([
                    ['Integrity', SectionIntegrity as Section],  // 6
                ])}
                {sectionGroup([
                    ['Costs', SectionCosts as Section],  // 3
                    ['Printable', SectionPrintable as Section],  // 2
                ])}

                {sectionGroup([
                    ['Offensive', SectionOffensive as Section],  // 3
                    ['Defensive', SectionDefensive as Section],  // 1
                    ['Cargo', SectionCargo as Section],  // 4
                ])}
                {sectionGroup([
                    ['Mobility', SectionMobility as Section],  // 7
                ])}

                {sectionGroup([
                    ['Electricity', SectionElectricity as Section],  // 2
                ])}
                {sectionGroup([
                    ['Automation', SectionAutomation as Section],  // 2
                ])}

                {sectionGroup([
                    ['Utils', SectionUtils as Section],  // 4
                ])}
                {sectionGroup([
                    ['Mods', SectionMods as Section],  // 4-6
                ])}

                {sectionGroup([
                    ['Materials', SectionMaterials as Section],  // INF
                ])}
                {sectionGroup([
                    ['Blocks', SectionBlocks as Section],  // INF
                ])}
            </Grid>
        </Grid>
    )
})) /* ============================================================================================================= */

type Section = React.ComponentType<{bp: IBlueprint, long?: boolean, narrow?: boolean} & StyledComponentProps<'root'>>
