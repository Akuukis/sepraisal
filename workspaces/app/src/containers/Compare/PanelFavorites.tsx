import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { ExpansionPanelProps, List, ListItem, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../common'
import MyExpansionPanel from '../../components/MyExpansionPanel'
import { CONTEXT } from '../../stores'
import SelectorRow from './PanelFavoritesRow'

const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    list: {
    },
    secondaryHeading: {
    },
})


interface IProps extends ExpansionPanelProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const { className, ...otherProps } = props
    const blueprintStore = React.useContext(CONTEXT.BLUEPRINTS)
    const favoriteStore = React.useContext(CONTEXT.FAVORITES)

    return (
        <MyExpansionPanel
            className={clsx(classes.root, className)}
            title='Favorites'
            subtitle={`${blueprintStore.favorites.size}`}
            classes={{secondaryHeading: classes.secondaryHeading}}
            {...otherProps}
        >
            <List dense className={classes.list}>
                <ListItem key='0'>
                    <Typography color='textSecondary' variant='body2' align='center'>
                        Favorite blueprints and they will show up here.
                    </Typography>
                </ListItem>
                {[...favoriteStore.favorites].map<JSX.Element>(({id, name}) => (
                    <SelectorRow
                        key={id}
                        id={id}
                        name={name}
                    />
                ))}
            </List>
        </MyExpansionPanel>
    )
})) /* ============================================================================================================= */
