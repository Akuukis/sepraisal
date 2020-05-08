import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'
import { ReactSortable } from 'react-sortablejs'

import { List } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'

import MyExpansionPanel, { IMyExpansionPanelProps } from '../../components/MyExpansionPanel'
import { CONTEXT } from '../../stores'
import SelectorRow from './PanelFavoritesRow'

const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    list: {
    },
    handle: {
        minWidth: 24 + theme.spacing(2),
    },
})


interface IProps extends Omit<IMyExpansionPanelProps, 'header' | 'subheader'> {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const { className, ...otherProps } = props
    const favoriteStore = React.useContext(CONTEXT.FAVORITES)

    return (
        <MyExpansionPanel
            className={clsx(classes.root, className)}
            header='Favorites'
            subheader={`${favoriteStore.favorites.length}`}
            {...otherProps}
        >
            <List dense className={classes.list}>
                <ReactSortable
                    handle={`.${classes.handle}`}
                    animation={theme.transitions.duration.standard}
                    list={[...favoriteStore.favorites]}
                    setList={favoriteStore.replace}
                >
                    {[...favoriteStore.favorites].map<JSX.Element>(({id, name}) => (
                        <SelectorRow
                            key={id}
                            id={id}
                            name={name}
                            classes={{handle: classes.handle}}
                        />
                    ))}
                </ReactSortable>
            </List>
        </MyExpansionPanel>
    )
})) /* ============================================================================================================= */
