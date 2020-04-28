import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Divider } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../common'
import PanelFavorites from './PanelFavorites'
import PanelRecent from './PanelRecent'
import PanelSelected from './PanelSelected'
import PanelUploads from './PanelUploads'

const styles = (theme: IMyTheme) => createStyles({
    root: {
        position: 'relative',
        padding: theme.spacing(0, 1),
    },

    divider: {
        marginTop: theme.spacing(2),
        backgroundColor: theme.palette.success.light,
    },
    list: {
        width: '100%',
    },
    secondaryHeading: {
        color: theme.palette.success.dark,
    },
    subpanel: {
    },
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const panelClasses = {
        root: classes.subpanel,
        list: classes.list,
        secondaryHeading: classes.secondaryHeading,
    }

    return (
        <div className={classes.root}>
            <PanelSelected classes={panelClasses} />
            <Divider className={classes.divider} />
            <PanelUploads elevation={0} classes={panelClasses} defaultExpanded />
            <Divider className={classes.divider} />
            <PanelFavorites elevation={0} classes={panelClasses} defaultExpanded />
            <Divider className={classes.divider} />
            <PanelRecent elevation={0} classes={panelClasses} />
        </div>
    )
})) /* ============================================================================================================= */
