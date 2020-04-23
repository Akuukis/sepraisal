import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Divider, Link, List, ListItem, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, DUD_URL as NOOP_URL, IMyTheme } from '../../common'
import MyExpansionPanel from '../../components/MyExpansionPanel'
import { CONTEXT } from '../../stores'
import SelectorRow from './Row'

const styles = (theme: IMyTheme) => createStyles({
    root: {
        backgroundColor: '#FFF',
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
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {browseFiles} = props
    const blueprintStore = React.useContext(CONTEXT.BLUEPRINTS)

    return (
        <div className={classes.root}>
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
            <Divider />
            <MyExpansionPanel title='Favorites' subtitle={`${blueprintStore.favorites.size} blueprints`} defaultExpanded>
                <List dense className={classes.list}>
                    <ListItem key='0'>
                        <Typography color='textSecondary' variant='body2' align='center'>
                            Favorite blueprints and they will show up here.
                        </Typography>
                    </ListItem>
                    {[...blueprintStore.favorites].map<JSX.Element>(([key, blueprint]) => (
                            <SelectorRow
                                key={key}
                                id={key}
                                title={`${blueprint.steam.title}, v${blueprint.steam.revision}`}
                            />
                        ))}
                </List>
            </MyExpansionPanel>
            <Divider />
            <MyExpansionPanel title='Recent' subtitle={`${blueprintStore.recent.size} blueprints`} defaultExpanded>
                <List dense className={classes.list}>
                    <ListItem key='0'>
                        <Typography color='textSecondary' variant='body2' align='center'>
                            Recently viewed blueprints will show up here.
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
