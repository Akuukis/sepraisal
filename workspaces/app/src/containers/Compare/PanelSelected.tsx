import clsx from 'clsx'
import * as React from 'react'
import { cold } from 'react-hot-loader'
import { ReactSortable } from 'react-sortablejs'

import { createStyles, ExpansionPanelProps, List, ListItem, Typography } from '@material-ui/core'

import { createSmartFC, IMyTheme } from '../../common'
import MyExpansionPanel from '../../components/MyExpansionPanel'
import { CONTEXT } from '../../stores'
import PanelSelectedRow from './PanelSelectedRow'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    secondaryHeading: {
    },
    list: {
    },
    handle: {
        minWidth: 24 + theme.spacing(2),
    },
})


interface IProps extends ExpansionPanelProps {
}


export default cold(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const { className, ...otherProps } = props
    const blueprintStore = React.useContext(CONTEXT.BLUEPRINTS)
    const selectionStore = React.useContext(CONTEXT.SELECTION)

    return (
        <MyExpansionPanel
            className={clsx(classes.root, className)}
            title='Selected'
            subtitle={`${selectionStore.selected.length}`}
            classes={{secondaryHeading: classes.secondaryHeading}}
            {...otherProps}
        >
            <List dense className={classes.list}>
                <ListItem key='0'>
                    <Typography color='textSecondary' variant='body2' align='center'>
                        Favorite blueprints and they will show up here.
                    </Typography>
                </ListItem>
                <ReactSortable
                    handle={`.${classes.handle}`}
                    animation={theme.transitions.duration.standard}
                    list={selectionStore.selectedItems}
                    setList={selectionStore.setSelectedItems}
                >
                    {selectionStore.selectedItems.map(({id, name}) => (
                        <PanelSelectedRow
                            classes={{handle: classes.handle}}
                            id={id}
                            title={blueprintStore.getSomething(id).steam!.title}
                        />
                    ))}
                </ReactSortable>
            </List>
        </MyExpansionPanel>
    )
})) /* ============================================================================================================= */
