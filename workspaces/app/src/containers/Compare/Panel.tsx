import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Divider, Grid, Link, Switch, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, DUD_URL, formatDecimal, IMyTheme } from 'src/common'
import { CONTEXT } from 'src/stores'

import PanelFavorites from './PanelFavorites'
import PanelRecent from './PanelRecent'
import PanelSelected from './PanelSelected'
import PanelUploads from './PanelUploads'

const styles = (theme: IMyTheme) => createStyles({
    root: {
        position: 'relative',
        padding: theme.spacing(0, 0),
    },

    list: {
        width: '100%',
        padding: theme.spacing(0),
    },
    subpanel: {
    },
    switchItem: {
        paddingRight: theme.spacing(2),
    },
    divider: {
        backgroundColor: theme.palette.primary.light,
        margin: theme.spacing(0, 2),
        height: 2,
    },
    footer: {
        padding: theme.spacing(2),
    }
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const blueprintStore = React.useContext(CONTEXT.BLUEPRINTS)
    const selectionStore = React.useContext(CONTEXT.SELECTION)

    const panelClasses = {
        root: classes.subpanel,
        list: classes.list,
    }

    const toggleNarrow = (event: React.ChangeEvent<HTMLInputElement>) => {
        selectionStore.setNarrow(event.target.checked)
    }

    return (
        <div className={classes.root}>
            <Grid container justify='flex-end'>
                <Grid item className={classes.switchItem}>
                    <Switch checked={selectionStore.narrow} onChange={toggleNarrow} />
                    <Typography component='label' variant='body1'>narrow columns</Typography>
                </Grid>
            </Grid>
            <PanelSelected classes={panelClasses} />
            <PanelFavorites classes={panelClasses} defaultExpanded />
            <PanelUploads classes={panelClasses} />
            <PanelRecent classes={panelClasses} />
            <Divider className={classes.divider} />
            <Typography paragraph variant='caption' className={classes.footer}>
                Uploads and Recents are cached locally in your browser.
                You can clear uploads above, and click <Link href={DUD_URL} onClick={blueprintStore.deleteRecentsPast100}>prune recents</Link> to clear all but last 100 recents.
                Memory used: {formatDecimal(blueprintStore.size/1024/1024, 1)}&nbsp;MB
            </Typography>
        </div>
    )
})) /* ============================================================================================================= */
