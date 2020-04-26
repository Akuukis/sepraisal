import { noop } from '@sepraisal/common'
import { runInAction } from 'mobx'
import * as Pako from 'pako'
import * as React from 'react'
import { useDropzone } from 'react-dropzone'
import { hot } from 'react-hot-loader/root'

import { createSmartFC, createStyles, IMyTheme } from '../../common'
import DefaultLayout from '../../layouts/DefaultLayout'
import { CONTEXT } from '../../stores'
import Columns from './Columns'
import SelectorDnDOverlay from './DnDOverlay'
import Panel from './Panel'

const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const piwikStore = React.useContext(CONTEXT.PIWIK)
    const selectionStore = React.useContext(CONTEXT.SELECTION)

    const blueprintStore = React.useContext(CONTEXT.BLUEPRINTS)
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
        <DefaultLayout
            aside={<Panel browseFiles={browseFiles} />}
            asideTitle='Compare'
            mainProps={{...getRootProps(), onClick: noop}}
            className={classes.root}
        >
            <input {...getInputProps()} />
            {isDragActive ? <SelectorDnDOverlay /> :  null}
            <Columns />
        </DefaultLayout>
    )
})) /* ============================================================================================================= */
