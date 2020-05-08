import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import {
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelProps,
    ExpansionPanelSummary,
    Typography,
} from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import { CONTEXT } from 'src/stores'

import ExpandMoreIcon from './icons/IconExpandMore'

const styles = (theme: IMyTheme) => createStyles({
    root: {
        '&::before': {
            backgroundColor: theme.palette.primary.light,
            display: 'inherit !important',
            height: 2,
            margin: theme.spacing(0, 2),
        },
    },

    details: {
        padding: theme.spacing(0, 2, 2, 0.5),
        flexDirection: 'column',
        borderLeftStyle: 'solid',
        borderLeftColor: theme.palette.primary.main,
        borderLeft: theme.spacing(1.5),
    },
    expanded: {
        margin: '0 !important',
        '&::before': {
            backgroundColor: theme.palette.primary.main,
            opacity: '1 !important',
        },
    },
    heading: {
        flexBasis: '33.33%',
        flexShrink: 0,
        lineHeight: 1,
        fontSize: theme.typography.pxToRem(16),
    },
    secondaryHeading: {
        color: theme.palette.primary.main,
        fontWeight: 500,
        lineHeight: 1,
        fontSize: theme.typography.pxToRem(16),
    },

    rootSuccess: {
        '&::before': {
            backgroundColor: theme.palette.success.light,
        },
    },
    detailsSuccess: {
        borderLeftColor: theme.palette.success.main,
    },
    expandedSuccess: {
        '&::before': {
            backgroundColor: theme.palette.success.main,
        },
    },
    secondaryHeadingSuccess: {
        color: theme.palette.success.main,
    },
})


export interface IMyExpansionPanelProps extends Omit<ExpansionPanelProps, 'title' | 'color'> {
    header: string
    subheader: React.ReactNode
    color?: 'primary' | 'success'
}


export default hot(createSmartFC(styles, __filename)<IMyExpansionPanelProps>(({children, classes, theme, ...props}) => {
    const { header, subheader, color, className, ...otherProps } = props
    const exclusiveScopeStore = React.useContext(CONTEXT.EXCLUSIVE_SCOPE)

    const isSuccess = color === 'success'

    const handleToggle = () => exclusiveScopeStore!.setValue(exclusiveScopeStore!.value === header ? null : header)

    React.useEffect(() => {
        if(exclusiveScopeStore && props.defaultExpanded) {
            exclusiveScopeStore.setValue(header)
        }
    }, [])

    return (
        <ExpansionPanel
            elevation={0}
            classes={{
                root: clsx(classes.root, isSuccess && classes.rootSuccess, className),
                expanded: clsx(classes.expanded, isSuccess && classes.expandedSuccess),
            }}
            expanded={exclusiveScopeStore && exclusiveScopeStore.value === header}
            onChange={exclusiveScopeStore && handleToggle}
            {...otherProps}
        >
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography
                    className={classes.heading}
                    variant='h3'
                >
                    {header}
                </Typography>
                <Typography
                    component='span'
                    className={clsx(classes.secondaryHeading, isSuccess && classes.secondaryHeadingSuccess)}
                >
                    {subheader}
                </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails
                className={clsx(classes.details, isSuccess && classes.detailsSuccess)}
            >
                {children}
            </ExpansionPanelDetails>
        </ExpansionPanel>
    )
})) /* ============================================================================================================= */
