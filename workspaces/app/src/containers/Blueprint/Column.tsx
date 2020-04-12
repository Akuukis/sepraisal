import { IBlueprint } from '@sepraisal/common'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid } from '@material-ui/core'
import { StyledComponentProps } from '@material-ui/core/styles'

import { createSmartFC, createStyles, GridSize, IMyTheme } from '../../common/'
import RowBlocks from './RowBlocks'
import RowComponents from './RowComponents'
import RowExport from './RowExport'
import RowHeader from './RowHeader'
import RowIngotsOres from './RowIngotsOres'
import RowIntegrity from './RowIntegrity'
import RowMobility from './RowMobility'
import RowWorkshop from './RowWorkshop'


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
})


interface IProps {
    bp: IBpProjection
    width: GridSize
}


export default hot(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {

    // @computed get anyError() {
    //     const { analysis } = props;
    //     return analysis.blocksErrors.length > 0
    //         || analysis.componentErrors.length > 0
    //         || analysis.ingotErrors.length > 0
    //         || analysis.oreErrors.length > 0
    // }

    const renderBox = (AnalysisRows: Row[], header = false) =>
        (
            <Grid item className={classes.item} xs={12} style={header ? {maxWidth: '100%'} : {}}>
                {AnalysisRows.map((AnalysisRow, i) => (<AnalysisRow key={i} width={props.width} bp={props.bp} />))}
            </Grid>
        )

    return (
        <Grid className={classes.root} container justify='center'>
            {renderBox([RowHeader          as Row], true)}
            {'steam' in props.bp ? renderBox([RowWorkshop        as Row]) : null}
            {renderBox([RowIntegrity       as Row, RowMobility        as Row])}
            {renderBox([RowExport          as Row])}
            {renderBox([RowBlocks          as Row])}
            {renderBox([RowComponents      as Row, RowIngotsOres      as Row])}
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

type Row = React.ComponentType<IProps & StyledComponentProps<'root'>>
