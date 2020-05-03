import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Badge } from '@material-ui/core'
import IconAnalyze from '@material-ui/icons/BarChart'
import IconCompare from '@material-ui/icons/CompareArrows'
import IconInfo from '@material-ui/icons/InfoOutlined'
import IconSearch from '@material-ui/icons/Search'

import { createSmartFC, createStyles, IMyTheme } from '../../../common/'
import { ROUTES } from '../../../constants/routes'
import { CONTEXT } from '../../../stores'
import NavigationButton from './NavigationButton'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    badge: {
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
            <NavigationButton to={ROUTES.BROWSE} Icon={IconSearch} title='Browse' />
            <NavigationButton to={ROUTES.BLUEPRINT} Icon={IconAnalyze} title='Analyze' />
            <Badge classes={{badge: classes.badge}} badgeContent={selectionStore.selected.length} color="secondary">
                <NavigationButton to={ROUTES.COMPARE} Icon={IconCompare} title='Compare' />
            </Badge>
            <NavigationButton to={ROUTES.INFO} Icon={IconInfo} title='Info' />
        </nav>
    )
})) /* ============================================================================================================= */
