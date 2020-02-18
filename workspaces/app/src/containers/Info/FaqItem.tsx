import { SERVICE_DESK_EMAIL } from '@sepraisal/common'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Divider, Grid, Paper, Typography,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { createSmartFC, createStyles, IMyTheme } from '../../common/'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        padding: '0.5em',
    },

    content: {
        display: 'block',
        paddingBottom: '0px',
    },
    expanded: {
    },
})


interface IProps {
    title: string
}


export default hot(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {

    return (
        <ExpansionPanel square={false} classes={{root: classes.root, expanded: classes.expanded}}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant='subtitle1'><strong>Q:</strong> {props.title}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.content}>
                {children}
            </ExpansionPanelDetails>
        </ExpansionPanel>
    )
})) /* ============================================================================================================= */
