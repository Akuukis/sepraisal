import clsx from 'clsx'
import { runInAction } from 'mobx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { List } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import MyExpansionPanel, { IMyExpansionPanelProps } from 'src/components/MyExpansionPanel'
import Upload from 'src/components/Upload'
import { CONTEXT } from 'src/stores'

import PanelUploadsRow from './PanelUploadsRow'

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
    const analyticsStore = React.useContext(CONTEXT.ANALYTICS)
    const selectionStore = React.useContext(CONTEXT.SELECTION)

    const onUpload = (title: string) => {
        runInAction(() => {
            selectionStore.selected.push(title)
        })
        analyticsStore.trackEvent(
            'workshop',
            'uploadSuccessful',
            title,
            undefined,
        )
    }
    const onError = (error: Error) => {
        console.error(error)
        analyticsStore.trackEvent(
            'workshop',
            'uploadFailed',
            error.message,
            undefined,
        )
    }

    return (
        <MyExpansionPanel
            className={clsx(classes.root, className)}
            header='Uploads'
            subheader={`${blueprintStore.uploads.size}`}
            {...otherProps}
        >
            <List dense className={classes.list}>
                <Upload onUpload={onUpload} onError={onError} />
                {blueprintStore.uploadsArray.map<JSX.Element>(([key]) => (
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
