import { noop } from '@sepraisal/common'
import classNames from 'classnames'
import { observable, runInAction } from 'mobx'
import * as Pako from 'pako'
import * as React from 'react'
import { useDropzone } from 'react-dropzone'
import { hot } from 'react-hot-loader/root'

import { Drawer, Paper } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../common/'
import { CONTEXT } from '../../stores'
import Columns from './Columns'
import SelectorDnDOverlay from './DnDOverlay'
import Panel from './Panel'

const styles = (theme: IMyTheme) => createStyles({
    root: {
        backgroundColor: '#FFF0',
        flexGrow: 1,
        height: `calc(100% - ${theme.spacing(2)}px)`,
        overflowY: 'scroll',
        padding: theme.spacing(1),
        transition: theme.transitions.create('margin', {
            duration: theme.transitions.duration.leavingScreen,
            easing: theme.transitions.easing.sharp,
        }),
    },

    drawer: {
        flexShrink: 0,
        width: drawerWidth,
    },
    drawerPaper: {
        height: 'calc(100% - 64px)',
        paddingTop: 64,
        width: drawerWidth,
        zIndex: 99,
    },
    rootShift: {
        marginLeft: drawerWidth,
        transition: theme.transitions.create('margin', {
            duration: theme.transitions.duration.enteringScreen,
            easing: theme.transitions.easing.easeOut,
        }),
    },
})


interface IProps {
}


export default hot(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {
    const piwikStore = React.useContext(CONTEXT.PIWIK)
    const selectionStore = React.useContext(CONTEXT.SELECTION)
    const [open, setOpen] = React.useState(true)

    const toggleDrawer = () => setOpen(!open)

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
        <Paper className={classNames(classes.root, {[classes.rootShift]: open})} {...getRootProps()} onClick={noop}>
            <input {...getInputProps()} />
            <Drawer
                className={classes.drawer}
                variant='persistent'
                anchor='left'
                open={open}
                classes={{paper: classes.drawerPaper}}
            >
                <Panel toggleDrawer={toggleDrawer} browseFiles={browseFiles} />
            </Drawer>
            {isDragActive ? <SelectorDnDOverlay /> :  null}
            <Columns />
        </Paper>
    )
})) /* ============================================================================================================= */


const drawerWidth = 360
