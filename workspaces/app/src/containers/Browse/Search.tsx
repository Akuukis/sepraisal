import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid, InputAdornment, Paper, TextField, Typography } from '@material-ui/core'
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import { AUTOCOMPLETE_AUTHORS } from 'src/common/authors'
import { AUTOCOMPLETE_COLLECTIONS } from 'src/common/collections'
import IconBrowse from 'src/components/icons/IconBrowse'
import IconCollection from 'src/components/icons/IconCollection'
import IconPerson from 'src/components/icons/IconPerson'
import { CONTEXT } from 'src/stores'

import SearchSort from './SearchSort'
import { ListboxComponent, renderGroup } from './SearchVirtualized'

const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    input: {
        backgroundColor: 'white',
    },
    autocomplete: {
        minWidth: 360,
        maxWidth: 720,
        flexGrow: 1,
        flexShrink: 1,
    },
    status: {
        flexGrow: 0,
        flexShrink: 0,
        padding: theme.spacing(2),
        color: theme.palette.primary.contrastText,
        minWidth: 240,
    },
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const cardStore = React.useContext(CONTEXT.CARDS)

    const handleChange = (event: React.ChangeEvent<{}>, newValue: IOption | string | null) => {
        if(newValue === null) {
            cardStore.setFind({$text: undefined})
        } else {
            const $search = typeof newValue === 'string' ? newValue : newValue.value
            cardStore.setFind({$text: {$search}})
        }
    }

    return (
        <Grid
            className={classes.root}
            item
            xs={12}

            container
            justify='center'
            alignItems='center'
        >
            <Autocomplete
                className={classes.autocomplete}
                id='free-solo-with-text-demo'
                freeSolo
                onChange={handleChange}
                filterOptions={(options: IOption[], params) => {
                    const filtered = filter(options, params) as IOption[]

                    // Suggest the creation of a new value
                    if (params.inputValue !== '') {
                        filtered.push(
                            // TODO: Learn MongoDB query syntax.
                            // { value: params.inputValue, type: OPTION_TYPE.OTHER, subtype: 'In description' },
                            // { value: params.inputValue, type: OPTION_TYPE.OTHER, subtype: 'In title' },
                            { value: params.inputValue, type: OPTION_TYPE.OTHER, subtype: 'Anywhere' },
                        )
                    }

                    return filtered
                }}
                groupBy={(option: IOption) => String(option.type)}
                selectOnFocus
                clearOnEscape
                options={AUTOCOMPLETE}
                getOptionLabel={(option: string | IOption) => {
                    if (typeof option === 'string') return option  // Value selected with enter, right from the input

                    return option.value
                }}
                ListboxComponent={ListboxComponent as React.ComponentType<React.HTMLAttributes<HTMLElement>>}
                renderGroup={renderGroup}
                renderOption={(option: IOption) => {
                    switch(option.type) {
                        case(OPTION_TYPE.AUTHOR): {
                            return <><IconPerson />&nbsp;{option.value} ({option.amount})</>
                        }
                        case(OPTION_TYPE.COLLECTION): {
                            return <><IconCollection />&nbsp;{option.value} ({option.amount})</>
                        }
                        case(OPTION_TYPE.OTHER): {
                            return <><IconBrowse />&nbsp;{option.subtype!} by "{option.value}"</>
                        }
                    }
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder='Search by id, title, author, collection, or any keyword in description...'
                        variant='outlined'
                        fullWidth
                        InputProps={{
                            ...params.InputProps,
                            className: clsx(params.InputProps.className, classes.input),
                            startAdornment: (
                                <InputAdornment position='start'>
                                    <IconBrowse color='primary' />
                                </InputAdornment>
                            ),
                        }}
                    />
                )}
            />
            <Paper>
                <SearchSort />
            </Paper>
            <Typography className={classes.status} variant='subtitle1' align='center'>
                {cardStore.count && `showing ${cardStore.cards.size} of ${cardStore.count} results`}
            </Typography>
        </Grid>
    )
})) /* ============================================================================================================= */


enum OPTION_TYPE {
    AUTHOR = 'By author',
    COLLECTION = 'By collection',
    OTHER = 'Search Text',
}

interface IOption {
    type: OPTION_TYPE
    value: string
    subtype?: 'In title' | 'In description' | 'Anywhere'
    amount?: number
}

const filter = createFilterOptions<IOption>()

const AUTOCOMPLETE: IOption[] = [
    ...AUTOCOMPLETE_AUTHORS.map<IOption>((entry) => ({type: OPTION_TYPE.AUTHOR, ...entry})),
    ...AUTOCOMPLETE_COLLECTIONS.map<IOption>((entry) => ({type: OPTION_TYPE.COLLECTION, ...entry})),
]
