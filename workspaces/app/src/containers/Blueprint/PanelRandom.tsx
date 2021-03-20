import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import {
    Button,
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    Grid,
    Radio,
    RadioGroup,
} from '@material-ui/core'

import { ASYNC_STATE, createSmartFC, createStyles, getApiUrl, IMyTheme } from 'src/common'
import { CONTEXT } from 'src/stores'
import { getPresetTitle, PRESET } from 'src/stores/CardStore'

const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    button: {
        margin: theme.spacing(1),
        minWidth: 240,
        maxWidth: 240,
    },
    helperText: {
    },
    label: {
    },
})


interface IProps extends React.ComponentProps<'form'> {
    select: (id: number) => void
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {select, className, ...otherProps} = props
    const analyticsStore = React.useContext(CONTEXT.ANALYTICS)
    const [value, setValue] = React.useState(Object.keys(PRESET)[0] as keyof typeof PRESET);
    const [status, setStatus] = React.useState<{code: ASYNC_STATE, text: string}>({code: ASYNC_STATE.Idle, text: ''})

    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue((event.target as HTMLInputElement).value as keyof typeof PRESET);
        setStatus({code: ASYNC_STATE.Idle, text: ''})
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(value === null) {
            setStatus({code: ASYNC_STATE.Error, text: 'Please select an option.'})
            return
        }

        const preset = PRESET[value]
        setStatus({code: ASYNC_STATE.Doing, text: 'Randomizing blueprint id ...'})
        try {
            const skip = Math.floor(Math.random() * 3800)  // Random blueprint out of first 90k blueprints.
            const res = await fetch(getApiUrl(preset, {projection: {_id: true}, limit: 1, skip}))
            const {docs} = await res.json() as {docs: [{_id: number}]}
            const id = docs[0]._id
            analyticsStore.trackEvent('blueprint', 'selectByRandom')
            select(id)
            setStatus({code: ASYNC_STATE.Done, text: 'Random ID selected!'})
        } catch(err) {
            setStatus({code: ASYNC_STATE.Error, text: `Randomizer: ${err.message}`})
        }
    };

    return (
        <form className={clsx(classes.root, className)} onSubmit={handleSubmit} {...otherProps}>
            <FormControl error={status.code === ASYNC_STATE.Error} fullWidth>
                <FormLabel className={classes.label}>Get a random blueprint:</FormLabel>
                <RadioGroup aria-label='random' name='random' value={value} onChange={handleRadioChange}>
                    {Object.keys(PRESET).map((name) => (
                        <FormControlLabel
                            key={name}
                            value={name}
                            control={<Radio color='primary' size='small' />}
                            label={getPresetTitle(name as keyof typeof PRESET)}
                        />
                    ))}
                </RadioGroup>
                <FormHelperText className={classes.helperText}>
                    {status.text}
                </FormHelperText>
                <Grid container justify='center'>
                    <Button type='submit' variant='outlined' color='primary' className={classes.button}>
                        Analyse Random
                    </Button>
                </Grid>
            </FormControl>
        </form>
    );
})) /* ============================================================================================================= */
