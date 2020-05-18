import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import {
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    Grid,
    GridProps,
    Typography,
} from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import { CONTEXT } from 'src/stores'

import CenterCell from '../Cell/CenterCell'
import ValueCell from '../Cell/ValueCell'
import ExpandMoreIcon from '../icons/IconExpandMore'
import MyBox from '../MyBox'
import MyBoxColumn from '../MyBoxColumn'
import MyBoxRow from '../MyBoxRow'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        padding: theme.spacing(1, 0),
        width: `100%`,
        minWidth: `${theme.shape.boxWidth}px`,
    },

    expansionPanel: {
        backgroundColor: theme.palette.success.light,
        borderRadius: `${theme.shape.borderRadius * 2}px !important`,
    },
    expansionPanelExpanded: {
        margin: '0 !important',
        borderRadius: `${theme.shape.borderRadius * 1}px !important`,
    },

    expansionPanelSummary: {
        padding: 0,
        backgroundColor: theme.palette.success.dark,
        borderRadius: theme.shape.borderRadius,
        minHeight: '0 !important',
    },
    expansionPanelSummaryContent: {
        margin: '0 !important',
    },
    expansionPanelSummaryExpanded: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    expansionPanelSummaryIcon: {
        marginLeft: -theme.spacing(4),
    },

    expansionPanelDetails: {
        padding: 0,
    },
    rootNarrow: {
    },
    CenterCell: {
        paddingLeft: theme.spacing(2),
        flexBasis: '60%',
        maxWidth: '60%',
    },
    heading: {
        width: '100%',
        color: theme.palette.success.contrastText,
    },
    MyBoxColumn: {
    },
    MyBoxRow: {
    },
    MyBox: {
    },
    MyBoxPaper: {
        backgroundColor: 'unset',
        boxShadow: theme.shadows[0],
    },
    ValueCell: {
        flexBasis: '40%',
        maxWidth: '40%',
    },
    ValueCellLabel: {
        color: theme.palette.success.light,
        width: '120%',
    },
    ValueCellValue: {
        color: theme.palette.success.contrastText,
        fontWeight: 500,
    },
})


interface IProps extends Omit<GridProps, 'classes'> {
    heading: string
    value: React.ReactNode
    label: React.ReactNode
    MyBoxColumnProps?: React.ComponentProps<typeof MyBoxColumn>
    innerChildren?: React.ReactNode
    narrow?: boolean
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {heading, value, label, MyBoxColumnProps, className, innerChildren, ...otherProps} = props
    const selectionStore = React.useContext(CONTEXT.SELECTION)

    const setExpaned = (event: React.ChangeEvent<{}>, expanded: boolean) => {
        selectionStore.setExpanded(heading, expanded)
    }

    const inner = innerChildren && (
        <MyBoxColumn
            className={classes.MyBoxColumn}
            width={3}
            {...MyBoxColumnProps}
            height={MyBoxColumnProps?.height && MyBoxColumnProps.height - 1}
        >
            {innerChildren}
        </MyBoxColumn>
    )

    return (
        <CONTEXT.PARENT_COLUMNS.Provider value={{parentColumns: 12, maxWidth: 3}}>
            <Grid
                className={clsx(classes.root, classes.rootNarrow, className)}
                component='section'

                item
            >
                <ExpansionPanel
                    elevation={0}
                    classes={{
                        root: clsx(classes.expansionPanel, className),
                        expanded: clsx(classes.expansionPanelExpanded),
                    }}
                    expanded={selectionStore.expanded.get(heading) ?? false}
                    onChange={setExpaned}
                >
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMoreIcon />}
                        classes={{
                            root: classes.expansionPanelSummary,
                            content: classes.expansionPanelSummaryContent,
                            expanded: classes.expansionPanelSummaryExpanded,
                            expandIcon: classes.expansionPanelSummaryIcon,
                        }}
                    >
                        <MyBoxColumn className={classes.MyBoxColumn} width={3}>
                            <MyBoxRow className={classes.MyBoxRow} width={3}>
                                <MyBox width={3} classes={{root: classes.MyBox, paper: classes.MyBoxPaper}}>
                                    <CenterCell className={classes.CenterCell}>
                                        <Typography
                                            variant='h4'
                                            display='block'
                                            noWrap
                                            className={classes.heading}
                                        >
                                            {heading}
                                        </Typography>
                                    </CenterCell>
                                    <ValueCell
                                        classes={{
                                            root: classes.ValueCell,
                                            label: classes.ValueCellLabel,
                                            value: classes.ValueCellValue,
                                        }}
                                        label={label}
                                        value={value}
                                    />
                                </MyBox>
                            </MyBoxRow>
                        </MyBoxColumn>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails
                        className={clsx(classes.expansionPanelDetails)}
                    >
                        <Grid
                            container
                            spacing={0}
                            justify='space-between'
                            {...otherProps}
                        >
                            {inner}
                            {children}
                        </Grid>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            </Grid>
        </CONTEXT.PARENT_COLUMNS.Provider>
    )
})) /* ============================================================================================================= */
