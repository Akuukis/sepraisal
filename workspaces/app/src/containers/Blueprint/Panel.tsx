import { idFromHref } from '@sepraisal/common'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { FormControl, FormGroup, FormHelperText, FormLabel, Input, InputAdornment, Typography } from '@material-ui/core'

import { ASYNC_STATE, createSmartFC, createStyles, IMyTheme, useAsyncEffectOnce } from 'src/common'
import IconBrowse from 'src/components/icons/IconBrowse'
import { CONTEXT } from 'src/stores'

import PanelRandom from './PanelRandom'

const styles = (theme: IMyTheme) => createStyles({
    root: {
        padding: theme.spacing(0, 4),
    },

    button: {
        margin: theme.spacing(1),
        minWidth: 240,
        maxWidth: 240,
        alignSelf: 'left',
    },
    formGroup: {
        margin: theme.spacing(2, 0),
    },
    input: {
    },
    footer: {
        marginTop: theme.spacing(8),
    },
    formLabel: {
        ...theme.typography.subtitle2,
        color: theme.palette.text.primary,
        '& > span': {
            color: theme.palette.error.main,
        },
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

    useAsyncEffectOnce(async () => {
        try {
            const id = validateId(extractId(location.href))
            setText(String(id))
            setStatus({code: ASYNC_STATE.Done, text: ''})
        } catch(err) {
        }
    })

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        setText(value)

        if(value === '') {
            setStatus({code: ASYNC_STATE.Idle, text: ''})
            routerStore.replace({...location, search: undefined})
            return
        }

        try {
            const id = validateId(extractId(value))
            select(id)
            setStatus({code: ASYNC_STATE.Done, text: `ID looks ok.`})
        } catch(err) {
            setStatus({code: ASYNC_STATE.Error, text: `Validation: ${err.message}`})
        }
        console.log('onchange')
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
    }

    const select = async (id: number) => {
        routerStore.replace({...location, search: `?id=${id}`})
    }

    return (
        <div
            className={classes.root}
        >
            <FormGroup className={classes.formGroup}>
                <FormControl
                    component='form'
                    required
                    onSubmit={handleSubmit}
                    error={status.code === ASYNC_STATE.Error}
                >
                    <FormLabel htmlFor='id' className={classes.formLabel}>Select a blueprint to analyse:</FormLabel>
                    <Input
                        autoFocus
                        id='id'
                        aria-describedby='id-helper-text'
                        className={classes.input}
                        startAdornment={(
                            <InputAdornment position='start'>
                                <IconBrowse />
                            </InputAdornment>
                        )}
                        placeholder='Enter Steam Workshop item URL or ID'
                        value={text}
                        onChange={handleChange}
                        fullWidth
                        readOnly={status.code === ASYNC_STATE.Doing}
                    />
                    <FormHelperText id='id-helper-text' className={classes.helper}>
                        {status.text}
                    </FormHelperText>
                </FormControl>
            </FormGroup>
            <PanelRandom />
            <Typography paragraph variant='caption' className={classes.footer}>
                Note that blueprints added to Steam Workshop less than 6 hours ago may not be available yet.
            </Typography>
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

