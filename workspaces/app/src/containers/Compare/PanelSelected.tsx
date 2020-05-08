import clsx from 'clsx'
import * as React from 'react'
import { cold } from 'react-hot-loader'
import { ReactSortable } from 'react-sortablejs'

import { createStyles, List } from '@material-ui/core'

import { createSmartFC, IMyTheme } from 'src/common'
import MyExpansionPanel, { IMyExpansionPanelProps } from 'src/components/MyExpansionPanel'
import { CONTEXT } from 'src/stores'

import PanelSelectedRow from './PanelSelectedRow'


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


export default cold(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const { className, ...otherProps } = props
    const blueprintStore = React.useContext(CONTEXT.BLUEPRINTS)
    const selectionStore = React.useContext(CONTEXT.SELECTION)

    return (
        <MyExpansionPanel
            className={clsx(classes.root, className)}
            header='Selected'
            subheader={`${selectionStore.selected.length}`}
            {...otherProps}
        >
            <List dense className={classes.list}>
                <ReactSortable
                    handle={`.${classes.handle}`}
                    animation={theme.transitions.duration.standard}
                    list={selectionStore.selectedItems}
                    setList={selectionStore.setSelectedItems}
                >
                    {selectionStore.selectedItems.map(({id, name}) => (
                        <PanelSelectedRow
                            key={id}
                            classes={{handle: classes.handle}}
                            id={id}
                        />
                    ))}
                </ReactSortable>
            </List>
        </MyExpansionPanel>
    )
})) /* ============================================================================================================= */
