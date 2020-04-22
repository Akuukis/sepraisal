import { IBlueprint } from '@sepraisal/common'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid } from '@material-ui/core'
import { StyledComponentProps } from '@material-ui/core/styles'

import { createSmartFC, createStyles, IMyTheme } from '../../common/'
import Header from './Header'
import SectionBlocks from './SectionBlocks'
import SectionIntegrity from './SectionIntegrity'
import SectionMaterials from './SectionMaterials'
import SectionMobility from './SectionMobility'
import SectionOffensive from './SectionOffensive'
import SectionWorkshop from './SectionWorkshop'


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
    bp: IBpProjection
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {bp} = props

    // @computed get anyError() {
    //     const { analysis } = props;
    //     return analysis.blocksErrors.length > 0
    //         || analysis.componentErrors.length > 0
    //         || analysis.ingotErrors.length > 0
    //         || analysis.oreErrors.length > 0
    // }

    const renderBox = (AnalysisSections: Section[], header = false) =>
        (
            <Grid item className={classes.item} xs={12} style={header ? {maxWidth: '100%'} : {}}>
                {AnalysisSections.map((AnalysisSection, i) => (<AnalysisSection key={i} bp={bp} />))}
            </Grid>
        )

    return (
        <Grid component='article' className={classes.root} container justify='center'>
            {renderBox([Header          as Section], true)}
            {'steam' in bp ? renderBox([SectionWorkshop        as Section]) : null}
            {renderBox([SectionIntegrity       as Section])}
            {renderBox([SectionMobility        as Section])}
            {renderBox([SectionOffensive        as Section])}
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

type Section = React.ComponentType<IProps & StyledComponentProps<'root'>>
