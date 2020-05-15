import { idFromHref } from '@sepraisal/common'
import clsx from 'clsx'
import { autorun } from 'mobx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { FormControl, FormHelperText, FormLabel, Input, InputAdornment } from '@material-ui/core'

import { ASYNC_STATE, createSmartFC, createStyles, IMyTheme } from 'src/common'
import IconBrowse from 'src/components/icons/IconBrowse'
import { CONTEXT } from 'src/stores'

const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    input: {
    },
    helperText: {
    },
    label: {
        ...theme.typography.h3,
    },
})


interface IProps extends React.ComponentProps<'form'> {
    select: (id: number) => void
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {select, className, ...otherProps} = props
    const routerStore = React.useContext(CONTEXT.ROUTER)

    const [text, setText] = React.useState('')
    const [status, setStatus] = React.useState<{code: ASYNC_STATE, text: string}>({code: ASYNC_STATE.Idle, text: ''})

    React.useEffect(() => {
        return autorun(() => {
            const id = validateId(idFromHref(routerStore.location.search))
            setText(String(id))
        })
    }, [])

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
            setStatus({code: ASYNC_STATE.Done, text: `ID looks ok.`})
            select(id)
        } catch(err) {
            setStatus({code: ASYNC_STATE.Error, text: `Validation: ${err.message}`})
        }
        console.log('onchange')
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
    }

    return (
        <form className={clsx(classes.root, className)} onSubmit={handleSubmit} {...otherProps}>
            <FormControl error={status.code === ASYNC_STATE.Error}>
                <FormLabel htmlFor='id' className={classes.label}>
                    Select a blueprint to analyse:
                </FormLabel>
                <Input
                    required
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
                <FormHelperText id='id-helper-text' className={classes.helperText}>
                    {status.text}
                </FormHelperText>
            </FormControl>
        </form>
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

