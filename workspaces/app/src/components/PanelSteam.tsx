import clsx from 'clsx'
import { autorun } from 'mobx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'
import { useLocation } from 'react-router-dom'

import { FormControl, FormHelperText, FormLabel, InputAdornment, TextField, Typography } from '@material-ui/core'

import { ASYNC_STATE, createSmartFC, createStyles, IMyTheme } from 'src/common'
import IconBrowse from 'src/components/icons/IconBrowse'
import { PROVIDER } from 'src/constants'
import { CONTEXT } from 'src/stores'

const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    input: {
    },
    helperText: {
    },
    label: {
    },
    footer: {
        marginTop: theme.spacing(2),
    },
})


interface IProps extends React.ComponentProps<'form'> {
    select: (id?: number | string) => void
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {select, className, ...otherProps} = props
    const analyticsStore = React.useContext(CONTEXT.ANALYTICS)
    const location = useLocation()

    const [text, setText] = React.useState('')
    const [status, setStatus] = React.useState<{code: ASYNC_STATE, text: string}>({code: ASYNC_STATE.Idle, text: ''})

    React.useEffect(() => {
        return autorun(() => {
            if(location.search === '') return
            setText(String(validateId(extractSteam(`${document.location.origin}${location.search}`))))
        })
    }, [])

    const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        setText(value)

        if(value === '') {
            setStatus({code: ASYNC_STATE.Idle, text: ''})
            select(undefined)
            return
        }

        try {
            const id = validateId(extractId(value))
            setStatus({code: ASYNC_STATE.Done, text: `ID looks ok.`})
            analyticsStore.trackEvent('blueprint', 'selectBySteam')
            select(id)
        } catch(err) {
            setStatus({code: ASYNC_STATE.Error, text: `Validation: ${err.message}`})
        }
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
    }

    return (
        <form className={clsx(classes.root, className)} onSubmit={handleSubmit} {...otherProps}>
            <FormControl error={status.code === ASYNC_STATE.Error} fullWidth>
                <FormLabel htmlFor='id' className={classes.label}>
                    Analyse a blueprint from Steam Workshop:
                </FormLabel>
                <TextField
                    required
                    autoFocus
                    id='id'
                    aria-describedby='id-helper-text'
                    className={classes.input}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position='start'>
                                <IconBrowse color='primary' />
                            </InputAdornment>
                        ),
                        readOnly: status.code === ASYNC_STATE.Doing,
                    }}
                    placeholder='Enter Steam Workshop item URL or ID'
                    value={text}
                    onChange={handleChange}
                    fullWidth
                    variant='outlined'
                />
                <FormHelperText id='id-helper-text' className={classes.helperText}>
                    {status.text}
                </FormHelperText>
                <Typography variant='caption' className={classes.footer}>
                    Note that blueprints added to Steam Workshop less than 6 hours ago may not be available yet.
                </Typography>
            </FormControl>
        </form>
    )
})) /* ============================================================================================================= */

const extractId = (text: string) => {
    let url: URL | null = null
    try {
        url = new URL(text)
    } catch(err) {
        // Do nothing.
    }
    if(url) {
        const id = url.searchParams.get('id')
        if(!id) throw new Error(`URL doesn't contain search parameter "${PROVIDER.STEAM}".`)

        return Number(id)
    }

    const id = Math.round(Number(text))
    if(text === id.toString()) return id

    throw new Error(`Invalid ID value.`)
}

const extractSteam = (text: string) => {
    let url: URL | null = null
    try {
        url = new URL(text)
    } catch(err) {
        // Do nothing.
    }
    if(url) {
        const id = url.searchParams.get(PROVIDER.STEAM)
        if(!id) throw new Error(`URL doesn't contain search parameter "${PROVIDER.STEAM}".`)

        return Number(id)
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
