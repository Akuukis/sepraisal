import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { ExpansionPanelProps, List } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../common'
import MyExpansionPanel from '../../components/MyExpansionPanel'
import { CONTEXT } from '../../stores'
import PanelRecentRow from './PanelRecentRow'

const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    details: {
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

    return (
        <MyExpansionPanel
            className={clsx(classes.root, className)}
            title='Recent'
            subtitle={`${blueprintStore.recent.size}`}
            classes={{details: classes.details, secondaryHeading: classes.secondaryHeading}}
            {...otherProps}
        >
            <List dense className={classes.list}>
                {[...blueprintStore.recent].map<JSX.Element>(([id, blueprint]) => (
                        <PanelRecentRow
                            key={id}
                            id={id}
                        />
                    ))}
            </List>
        </MyExpansionPanel>
    )
})) /* ============================================================================================================= */
