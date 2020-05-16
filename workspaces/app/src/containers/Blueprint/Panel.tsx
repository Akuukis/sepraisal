import { idFromHref } from '@sepraisal/common'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Divider } from '@material-ui/core'

import { ASYNC_STATE, createSmartFC, createStyles, IMyTheme, useAsyncEffectOnce } from 'src/common'
import { CONTEXT } from 'src/stores'

import PanelRandom from './PanelRandom'
import PanelSteam from './PanelSteam'
import PanelUpload from './PanelUpload'

const styles = (theme: IMyTheme) => createStyles({
    root: {
        paddingBottom: theme.spacing(4),
    },

    label: {
        margin: theme.spacing(2, 0),
        color: theme.palette.text.primary,
        '& > span': {
            color: theme.palette.error.main,
        },
    },
    divider: {
        backgroundColor: theme.palette.primary.light,
        display: 'inherit !important',
        height: 2,
        margin: theme.spacing(2, 0),
    },
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const routerStore = React.useContext(CONTEXT.ROUTER)

    const [text, setText] = React.useState('')
    const [status, setStatus] = React.useState<{code: ASYNC_STATE, text: string}>({code: ASYNC_STATE.Idle, text: ''})

    useAsyncEffectOnce(async () => {
        try {
            const id = validateId(extractId(location.href))
            setText(String(id))
            setStatus({code: ASYNC_STATE.Done, text: ''})
        } catch(err) {
        }
    })

    const select = async (id: number | string) => {
        if(typeof id === 'number') {
            routerStore.replace({...location, search: `?id=${id}`})
        } else if(typeof id === 'string') {
            routerStore.replace({...location, search: `?upload=${id}`})
        } else {
        }
    }

    return (
        <div
            className={classes.root}
        >
            <PanelSteam classes={{label: classes.label}} select={select} />
            <Divider className={classes.divider} />
            <PanelRandom classes={{label: classes.label}} select={select} />
            <Divider className={classes.divider} />
            <PanelUpload classes={{label: classes.label}} select={select} />
        </div>
    )
})) /* ============================================================================================================= */

const extractId = (text: string) => {
    let url: URL | null = null
    try {
        url = new URL(text)
    } catch(err) {
    }
    if(url) {
        const id = idFromHref(url.href)
        if(!id) throw new Error(`URL doesn't contain search parameter "id".`)

        return id
    }

    const id = Math.round(Number(text))
    if(text === id.toString()) return id

    throw new Error(`Invalid ID value.`)
}

const validateId = (id: number): number => {
    const idString = id.toString()
    if(idString.length < 9) throw new Error(`ID is too short, require 9-10 digits.`)
    if(idString.length > 10) throw new Error(`ID is too long, require 9-10 digits.`)

    return id
}

