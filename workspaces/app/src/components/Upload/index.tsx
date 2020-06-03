import { noop } from '@sepraisal/common'
import * as Pako from 'pako'
import * as React from 'react'
import { useDropzone } from 'react-dropzone'
import { hot } from 'react-hot-loader/root'

import { ListItem, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, DUD_URL, IMyTheme } from 'src/common'
import { CONTEXT } from 'src/stores'

import MyLink from '../MyLink'
import SelectorDnDOverlay from './DnDOverlay'

const styles = (theme: IMyTheme) => createStyles({
    root: {
        borderStyle: `dashed`,
        borderWidth: theme.spacing(1),
        borderColor: `${theme.palette.text.secondary}B0`,
        '&:hover': {
            color: theme.palette.text.primary,
            borderColor: theme.palette.text.secondary,
        },
        height: '72px',
    },

    text: {
        width: '100%',
    },
})


interface IProps {
    onUpload: (title: string) => void
    onError: (error: Error) => void
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {onUpload, onError} = props
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
                                // console.error(`inflate failed ${error}`)
                                const out = result.toString('utf-8')
                                resolve(out)
                            }
                    }
                    reader.onabort = reject
                    reader.onerror = reject
                    reader.readAsText(file)
                })

                // TODO: Guard against not-yet-loaded praisalManagaer, but practically good luck dropping before that.
                const title = blueprintStore.setUpload(await praisalManager!.praiseSbc(xml))
                onUpload(title)
            } catch(err) {
                onError(err)
            }
        }
    }, [])


    const {getRootProps, getInputProps, isDragActive, open: browseFiles} = useDropzone({onDrop})

    return (
        <ListItem className={classes.root} {...{...getRootProps(), onClick: noop}}>
            <input {...getInputProps()} />
            {isDragActive ? <SelectorDnDOverlay /> :  null}
            <Typography className={classes.text} variant='body1' align='center'>
                Drop .sbc file here or&nbsp;<MyLink href={DUD_URL} onClick={browseFiles}>click to upload</MyLink>.
            </Typography>
        </ListItem>
    )
})) /* ============================================================================================================= */
