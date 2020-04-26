import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Divider } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../common'
import PanelFavorites from './PanelFavorites'
import PanelRecent from './PanelRecent'
import PanelUploads from './PanelUploads'

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
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {

    return (
        <div className={classes.root}>
            <PanelUploads />
            <Divider />
            <PanelFavorites />
            <Divider />
            <PanelRecent />
        </div>
    )
})) /* ============================================================================================================= */
