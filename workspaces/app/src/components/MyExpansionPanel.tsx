import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import {
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    Typography,
    ExpansionPanelProps,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { createSmartFC, createStyles, IMyTheme } from '../common/'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    details: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingBottom: 0,
    },
    expanded: {
        margin: '0 !important',
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
})


interface IProps extends Omit<ExpansionPanelProps, 'title'> {
    title: React.ReactNode
    subtitle: React.ReactNode
}


export default hot(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {
    const { title, subtitle, ...otherProps } = props

    return (
        <ExpansionPanel classes={{root: classes.root, expanded: classes.expanded}} {...otherProps}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading} variant='h3'>{title}</Typography>
                <Typography component='span' className={classes.secondaryHeading}>{subtitle}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.details}>
                {children}
            </ExpansionPanelDetails>
        </ExpansionPanel>
    )
})) /* ============================================================================================================= */
