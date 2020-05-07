import { idFromHref } from '@sepraisal/common'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { FormControl, FormHelperText, FormLabel, Input, InputAdornment, Typography } from '@material-ui/core'

import { ASYNC_STATE, createSmartFC, createStyles, IMyTheme } from '../../common'
import IconBrowse from '../../components/icons/IconBrowse'
import { CONTEXT } from '../../stores'

const styles = (theme: IMyTheme) => createStyles({
    root: {
        margin: theme.spacing(4),
    },

    input: {
    },
    footer: {
        marginTop: theme.spacing(8),
        marginBottom: theme.spacing(-2),
    },
    helper: {
    },
    submitHack: {
        position: 'absolute',
        left: '-9999px',
    }
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const blueprintStore = React.useContext(CONTEXT.BLUEPRINTS)
    const selectionStore = React.useContext(CONTEXT.SELECTION)
    const routerStore = React.useContext(CONTEXT.ROUTER)

    const [text, setText] = React.useState('')
    const [status, setStatus] = React.useState<{code: ASYNC_STATE, text: string}>({code: ASYNC_STATE.Idle, text: ''})

    const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        setText(value)

        try {
            const id = validateId(extractId(value))
            setStatus({code: ASYNC_STATE.Done, text: String(id)})
        } catch(err) {
            setStatus({code: ASYNC_STATE.Error, text: `Validation: ${err.message}`})
        }
    }

    const handleOnSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const id = validateId(extractId(text))
        routerStore.replace({...location, search: `?id=${id}`})

        const blueprint = blueprintStore.getSomething(id)
        if(blueprint) {
            setStatus({code: ASYNC_STATE.Done, text: ''})
            return
        }

        setStatus({code: ASYNC_STATE.Doing, text: 'Fetching...'})
        try {
            await blueprintStore.fetch(id)
            setStatus({code: ASYNC_STATE.Done, text: 'Fetched!'})
        } catch(err) {
            setStatus({code: ASYNC_STATE.Error, text: `ID ${id}: ${err.message}`})
        }
    }

    return (
        <FormControl
            component='form'
            className={classes.root}
            required
            onSubmit={handleOnSubmit}
            error={status.code === ASYNC_STATE.Error}
        >
            <FormLabel htmlFor="my-input">Select a blueprint to analyse</FormLabel>
            <Input
                autoFocus
                id="my-input"
                aria-describedby="my-helper-text"
                className={classes.input}
                startAdornment={(
                    <InputAdornment position='start'>
                        <IconBrowse />
                    </InputAdornment>
                )}
                placeholder='Enter Steam Workshop item URL or ID'
                value={text}
                onChange={handleOnChange}
                fullWidth
                readOnly={status.code === ASYNC_STATE.Doing}
            />
            <FormHelperText className={classes.helper}>
                {status.text}
            </FormHelperText>
            <input type='submit' className={classes.submitHack} tabIndex={-1} />
            <Typography paragraph variant='caption' className={classes.footer}>
                Note that blueprints added to Steam Workshop less than 6 hours ago may not be available yet.
            </Typography>
        </FormControl>
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

