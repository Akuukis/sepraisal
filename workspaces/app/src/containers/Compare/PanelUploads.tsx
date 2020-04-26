import { noop } from '@sepraisal/common'
import { runInAction } from 'mobx'
import * as Pako from 'pako'
import * as React from 'react'
import { useDropzone } from 'react-dropzone'
import { hot } from 'react-hot-loader/root'

import { Link, List, ListItem, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, DUD_URL as NOOP_URL, IMyTheme } from '../../common'
import MyExpansionPanel from '../../components/MyExpansionPanel'
import { CONTEXT } from '../../stores'
import SelectorDnDOverlay from './DnDOverlay'
import SelectorRow from './Row'

const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    list: {
    }
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const blueprintStore = React.useContext(CONTEXT.BLUEPRINTS)
    const piwikStore = React.useContext(CONTEXT.PIWIK)
    const selectionStore = React.useContext(CONTEXT.SELECTION)
    const praisalManager = React.useContext(CONTEXT.PRAISAL_MANAGER)

    const onDrop = React.useCallback(async (acceptedFiles, rejectedFiles) => {
        for(const file of acceptedFiles) {
            try {
                const reader = new FileReader()
                const xml = await new Promise((resolve: (res: string) => void, reject) => {
                    reader.onload = (event) => {
                            // tslint:disable-next-line: no-any - TODO fix typings
                            const {result}: any = event.target
                            try {
                                const out = Pako.inflate(result, {to: 'string'})
                                resolve(out)
                            } catch(error) {
                                console.error(`inflate failed ${error}`)
                                const out = result.toString('utf-8')
                                resolve(out)
                            }
                    }
                    reader.onabort = reject
                    reader.onerror = reject
                    reader.readAsText(file)
                })

                const title = blueprintStore.setUpload(await praisalManager.praiseXml(xml))
                runInAction(() => {
                    selectionStore.selected.push(title)
                })
                piwikStore.push([
                    'trackEvent',
                    'workshop',
                    'upload-successful',
                    title,
                    undefined,
                ])

            } catch(err) {
                piwikStore.push([
                    'trackEvent',
                    'workshop',
                    'upload-failed',
                    err.message,
                    undefined,
                ])

            }
        }
    }, [])


    const {getRootProps, getInputProps, isDragActive, open: browseFiles} = useDropzone({onDrop})

    return (
        <MyExpansionPanel className={classes.root} title='Uploads' subtitle={`${blueprintStore.uploads.size} blueprints`} defaultExpanded>
            <input {...getInputProps()} />
            {isDragActive ? <SelectorDnDOverlay /> :  null}
            <List dense className={classes.list}>
                <ListItem key='0' {...{...getRootProps(), onClick: noop}}>
                    <Typography color='textSecondary' variant='body2' align='center'>
                        "Drag and drop" or&nbsp;<Link href={NOOP_URL} variant='body1' onClick={browseFiles}>upload</Link>&nbsp; (sbc only).
                    </Typography>
                </ListItem>
                {[...blueprintStore.uploads].map<JSX.Element>(([key]) => (
                    <SelectorRow
                        key={key}
                        id={key}
                        title={key}
                    />
                ))}
            </List>
        </MyExpansionPanel>
    )
})) /* ============================================================================================================= */
