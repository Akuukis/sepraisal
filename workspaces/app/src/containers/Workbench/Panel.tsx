import { IObservableArray } from 'mobx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import {
    Divider,
    IconButton,
    Link,
    List,
    ListItem,
    Typography,
} from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'

import { createSmartFC, createStyles, DUD_URL as NOOP_URL, IMyTheme } from '../../common/'
import { CONTEXT } from '../../stores'
import SelectorRow from './Row'
import MyExpansionPanel from '../../components/MyExpansionPanel'

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
    list: {
        width: '100%',
    }
})


interface IProps {
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
            <MyExpansionPanel title='Uploads' subtitle={`${blueprintStore.uploads.size} blueprints`} defaultExpanded>
                <List dense className={classes.list}>
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
                        />
                    ))}
                </List>
            </MyExpansionPanel>
            <MyExpansionPanel title='Recent' subtitle={`${blueprintStore.recent.size} blueprints`} defaultExpanded>
                <List dense className={classes.list}>
                    <ListItem key='0'>
                        <Typography color='textSecondary' variant='body2' align='center'>
                            Browse and blueprints will show up here.
                        </Typography>
                    </ListItem>
                    {[...blueprintStore.recent].map<JSX.Element>(([key, blueprint]) => (
                            <SelectorRow
                                key={key}
                                id={key}
                                title={`${blueprint.steam.title}, v${blueprint.steam.revision}`}
                            />
                        ))}
                </List>
            </MyExpansionPanel>
        </div>
    )
})) /* ============================================================================================================= */
