import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Chip, Grid, InputAdornment, Paper, TextField, Typography } from '@material-ui/core'
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
    const [input, setInput] = React.useState('')
    const [value, setValue] = React.useState<IOption|null>(null)

    const handleInput = (event: React.ChangeEvent<{}>, newInputValue: string) => {
        setInput(newInputValue)
    }

    const authors = ((cardStore.querryFindBuilder.getCriterion('steam.author.title') ?? {$in: []}).$in ?? []) as string[]
    const collections = ((cardStore.querryFindBuilder.getCriterion('steam.collections.title') ?? {$in: []}).$in ?? []) as string[]

    console.log([...authors], [...collections])

    const handleChange = (event: React.ChangeEvent<{}>, newValue: IOption | string | null) => {
        if(newValue === null) {
            cardStore.setFind({$text: undefined})
            setValue(null)
        } else if(typeof newValue === 'string') {  // Pressed ENTER and so we receive plain string.
            cardStore.setFind({$text: {$search: newValue}})
            setValue({type: OPTION_TYPE.OTHER, value: newValue})
        } else if(newValue.type === OPTION_TYPE.AUTHOR || newValue.subtype === OPTION_TYPE.AUTHOR) {
            cardStore.querryFindBuilder.setCriterion('steam.author.title', {$in: [...authors, newValue.value]})
            cardStore.setFind({$text: undefined})
            setValue(null)
            setInput('')
        } else if(newValue.type === OPTION_TYPE.COLLECTION || newValue.subtype === OPTION_TYPE.COLLECTION) {
            cardStore.querryFindBuilder.setCriterion('steam.collections.title', {$in: [...collections, newValue.value]})
            cardStore.setFind({$text: undefined})
            setValue(null)
            setInput('')
        } else if(newValue.type === OPTION_TYPE.OTHER) {
            cardStore.setFind({$text: {$search: newValue.value}})
            setValue(newValue)
        }
    }

    const HandleDelete = (option: IOption) => () => {
        if(option.type === OPTION_TYPE.AUTHOR) {
            const newCriteria = {$in: authors.filter((author) => author !== option.value)}
            cardStore.querryFindBuilder.setCriterion('steam.author.title', newCriteria.$in.length > 0 ? newCriteria : null)
        } else if(option.type === OPTION_TYPE.COLLECTION) {
            const newCriteria = {$in: collections.filter((collection) => collection !== option.value)}
            cardStore.querryFindBuilder.setCriterion('steam.collections.title', newCriteria.$in.length > 0 ? newCriteria : null)
        } else {
            throw new Error('catch me')
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
                inputValue={input}
                onInputChange={handleInput}
                value={value}
                freeSolo
                onChange={handleChange}
                filterOptions={(options: IOption[], params) => {
                    if (params.inputValue !== '') {
                        options.push(
                            // TODO: Learn MongoDB query syntax.
                            // { value: params.inputValue, type: OPTION_TYPE.OTHER, subtype: 'In description' },
                            // { value: params.inputValue, type: OPTION_TYPE.OTHER, subtype: 'In title' },
                        )
                    }

                    const filtered = filter(options, params) as IOption[]

                    // Suggest the creation of a new value
                    if (params.inputValue !== '') {
                        filtered.push(
                            // TODO: Learn MongoDB query syntax.
                            // { value: params.inputValue, type: OPTION_TYPE.OTHER, subtype: 'In description' },
                            // { value: params.inputValue, type: OPTION_TYPE.OTHER, subtype: 'In title' },
                            { value: params.inputValue, type: OPTION_TYPE.OTHER, subtype: OPTION_TYPE.AUTHOR },
                            { value: params.inputValue, type: OPTION_TYPE.OTHER, subtype: OPTION_TYPE.COLLECTION },
                            { value: params.inputValue, type: OPTION_TYPE.OTHER, subtype: 'Anywhere by' },
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
                renderTags={(value, getTagProps) => [
                ]}
                renderGroup={renderGroup}
                renderOption={({type, subtype, value, amount}: IOption) => {
                    switch(type) {
                        case(OPTION_TYPE.AUTHOR): {
                            return <><IconPerson />&nbsp;{amount ? `${value} (${amount})` : `"${value}"`}</>
                        }
                        case(OPTION_TYPE.COLLECTION): {
                            return <><IconCollection />&nbsp;{amount ? `${value} (${amount})` : `"${value}"`}</>
                        }
                        case(OPTION_TYPE.OTHER): {
                            return <><IconBrowse />&nbsp;{subtype} "{value}"</>
                        }
                    }
                }}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder='Search author, collection, or free text ...'
                        variant='outlined'
                        fullWidth
                        InputProps={{
                            ...params.InputProps,
                            className: clsx(params.InputProps.className, classes.input),
                            startAdornment: [
                                (<InputAdornment position='start'>
                                    <IconBrowse color='primary' />
                                </InputAdornment>),
                                ...authors.map((author: string, index: number) => (
                                    <Chip
                                        icon={<IconPerson />}
                                        variant='outlined'
                                        key={author}
                                        label={author}
                                        onDelete={HandleDelete({type: OPTION_TYPE.AUTHOR, value: author})}
                                    />
                                )),
                                ...collections.map((collection: string, index: number) => (
                                    <Chip
                                        icon={<IconCollection />}
                                        variant='outlined'
                                        key={collection}
                                        label={collection}
                                        onDelete={HandleDelete({type: OPTION_TYPE.COLLECTION, value: collection})}
                                    />
                                )),
                            ],
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
    OTHER = 'Search',
}

interface IOption {
    type: OPTION_TYPE
    value: string
    subtype?: string//'In title' | 'In description' | 'Anywhere'
    amount?: number
}

const filter = createFilterOptions<IOption>()

const AUTOCOMPLETE: IOption[] = [
    ...AUTOCOMPLETE_AUTHORS.map<IOption>((entry) => ({type: OPTION_TYPE.AUTHOR, ...entry})),
    ...AUTOCOMPLETE_COLLECTIONS.map<IOption>((entry) => ({type: OPTION_TYPE.COLLECTION, ...entry})),
]
