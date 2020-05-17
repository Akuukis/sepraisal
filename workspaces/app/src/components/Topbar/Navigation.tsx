import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Badge } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import { ROUTES } from 'src/constants/routes'
import { CONTEXT } from 'src/stores'

import IconAnalyse from '../icons/IconAnalyse'
import IconBrowse from '../icons/IconBrowse'
import IconCompare from '../icons/IconCompare'
import IconInfo from '../icons/IconInfo'
import NavigationButton from './NavigationButton'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        display: 'flex',
    },

    badge: {
        color: theme.palette.text.primary,
        right: `1.2em`,
        top: `1.2em`,
    },
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const selectionStore = React.useContext(CONTEXT.SELECTION)

    return (
        <nav className={classes.root}>
            <NavigationButton to={ROUTES.BROWSE} Icon={IconBrowse} title='Browse' />
            <NavigationButton to={ROUTES.ANALYSE} Icon={IconAnalyse} title='Analyse' />
            <Badge classes={{badge: classes.badge}} badgeContent={selectionStore.selected.length} color="secondary">
                <NavigationButton to={ROUTES.COMPARE} Icon={IconCompare} title='Compare' />
            </Badge>
            <NavigationButton to={ROUTES.INFO} Icon={IconInfo} title='Info' />
        </nav>
    )
})) /* ============================================================================================================= */
