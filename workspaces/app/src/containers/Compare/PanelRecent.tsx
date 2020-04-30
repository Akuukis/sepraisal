import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { List } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../common'
import MyExpansionPanel, { IMyExpansionPanelProps } from '../../components/MyExpansionPanel'
import { CONTEXT } from '../../stores'
import PanelRecentRow from './PanelRecentRow'

const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    list: {
    },
})


interface IProps extends Omit<IMyExpansionPanelProps, 'header' | 'subheader'> {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const { className, ...otherProps } = props
    const blueprintStore = React.useContext(CONTEXT.BLUEPRINTS)

    const blueprints = [...blueprintStore.recent].sort(([_, a], [__, b]) => b._cached.diff(a._cached))

    return (
        <MyExpansionPanel
            className={clsx(classes.root, className)}
            header='Recent'
            subheader={`${blueprintStore.recent.size}`}
            {...otherProps}
        >
            <List dense className={classes.list}>
                {blueprints.map<JSX.Element>(([id, blueprint]) => (
                        <PanelRecentRow
                            key={id}
                            id={id}
                        />
                    ))}
            </List>
        </MyExpansionPanel>
    )
})) /* ============================================================================================================= */
