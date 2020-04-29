import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { List } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../common'
import MyExpansionPanel, { IMyExpansionPanelProps } from '../../components/MyExpansionPanel'
import { CONTEXT } from '../../stores'
import PanelUploadsRow from './PanelUploadsRow'
import PanelUploadsUpload from './PanelUploadsUpload'

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

    return (
        <MyExpansionPanel
            className={clsx(classes.root, className)}
            header='Uploads'
            subheader={`${blueprintStore.uploads.size}`}
            color='success'
            {...otherProps}
        >
            <List dense className={classes.list}>
                <PanelUploadsUpload />
                {[...blueprintStore.uploads].map<JSX.Element>(([key]) => (
                    <PanelUploadsRow
                        key={key}
                        id={key}
                        title={key}
                    />
                ))}
            </List>
        </MyExpansionPanel>
    )
})) /* ============================================================================================================= */
