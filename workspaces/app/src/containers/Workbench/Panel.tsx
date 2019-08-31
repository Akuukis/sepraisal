import { IObservableArray } from 'mobx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import {
    Divider,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    IconButton,
    Link,
    List,
    ListItem,
    Typography,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { createSmartFC, createStyles, DUD_URL as NOOP_URL, IMyTheme } from '../../common/'
import { CONTEXT } from '../../stores'
import SelectorRow from './Row'

const styles = (theme: IMyTheme) => createStyles({
    root: {
        backgroundColor: '#FFF',
        paddingBottom: theme.spacing(2),
        position: 'relative',
    },

    closeButton: {
        color: theme.palette.grey[500],
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
    },
    content: {
    },
    heading: {
        flexBasis: '33.33%',
        flexShrink: 0,
        fontSize: theme.typography.pxToRem(15),
    },
    secondaryHeading: {
        color: theme.palette.text.secondary,
        fontSize: theme.typography.pxToRem(15),
    },
})


interface IProps {
    selected: IObservableArray<string>
    browseFiles(): void
    toggleDrawer(): void
}


export default hot(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {
    const blueprintStore = React.useContext(CONTEXT.BLUEPRINTS)
    const {toggleDrawer, browseFiles} = props

    return (
        <div className={classes.root}>
            <Typography variant='h4' align='center' style={{margin: 16}}>{'Compare'}</Typography>
            <IconButton aria-label='Close' className={classes.closeButton} onClick={toggleDrawer}>
                <CloseIcon />
            </IconButton>
            <Divider />
            <ExpansionPanel defaultExpanded>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>Uploads</Typography>
                    <Typography className={classes.secondaryHeading}>{`${blueprintStore.uploads.size} blueprints`}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.content}>
                    <List dense style={{width: '100%'}}>
                        <ListItem key='0'>
                            <Typography color='textSecondary' variant='body2' align='center'>
                                "Drag and drop" or&nbsp;<Link href={NOOP_URL} variant='body1' onClick={browseFiles}>upload</Link>&nbsp; (sbc only).
                            </Typography>
                        </ListItem>
                        {[...blueprintStore.uploads].map<JSX.Element>(([key]) => (
                            <SelectorRow
                                key={key}
                                id={key}
                                title={key}
                                selected={props.selected}
                            />
                        ))}
                    </List>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <ExpansionPanel defaultExpanded>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography className={classes.heading}>Recent</Typography>
                    <Typography className={classes.secondaryHeading}>{`${blueprintStore.recent.size} blueprints`}</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.content}>
                    <List dense style={{width: '100%'}}>
                        <ListItem key='0'>
                            <Typography color='textSecondary' variant='body2' align='center'>
                                Browse and blueprints will show up here.
                            </Typography>
                        </ListItem>
                        {[...blueprintStore.recent].map<JSX.Element>(([key, blueprint]) => (
                                <SelectorRow
                                    key={key}
                                    id={key}
                                    selected={props.selected}
                                    title={`${blueprint.steam.title}, v${blueprint.steam.revision}`}
                                />
                            ))}
                    </List>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </div>
    )
})) /* ============================================================================================================= */
