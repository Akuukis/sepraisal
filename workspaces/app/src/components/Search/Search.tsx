import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Chip, InputAdornment, TextField } from '@material-ui/core'
import Autocomplete, { AutocompleteProps, createFilterOptions } from '@material-ui/lab/Autocomplete'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import { AUTOCOMPLETE_AUTHORS } from 'src/common/authors'
import { AUTOCOMPLETE_COLLECTIONS } from 'src/common/collections'
import IconBrowse from 'src/components/icons/IconBrowse'
import IconCollection from 'src/components/icons/IconCollection'
import IconPerson from 'src/components/icons/IconPerson'
import { BROWSE_PARTS, ROUTE } from 'src/constants'
import { CONTEXT } from 'src/stores'

import { ListboxComponent, renderGroup } from './SearchVirtualized'

const styles = (theme: IMyTheme) => createStyles({
    root: {
        maxWidth: 640,
        flexGrow: 1,
        flexShrink: 1,
        '& > div': {  // Autocomplete looks like doesn't have `formControl` style prop, hence this.
            margin: 0,
        },
        backgroundColor: theme.palette.background.paper,
        borderBottomLeftRadius: theme.shape.borderRadius,
        borderTopLeftRadius: theme.shape.borderRadius,
    },

    input: {
        borderRadius: 0,
        borderBottomLeftRadius: theme.shape.borderRadius,
        borderTopLeftRadius: theme.shape.borderRadius,
        minHeight: 44,
    },
    inputInput: {
        minWidth: '64px !important',
    },
    inputAdornment: {
        margin: theme.spacing(0, 0, 0, 1)
    },
    chip: {
        margin: theme.spacing(0, 0.5),
    },
})


interface IProps extends Omit<AutocompleteProps<IOption>, 'renderInput' | 'options'> {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {className, ...otherProps} = props
    const cardStore = React.useContext(CONTEXT.CARDS)
    const routerStore = React.useContext(CONTEXT.ROUTER)

    const searchParams = new URLSearchParams(routerStore.location.search)
    const authors = searchParams.getAll(BROWSE_PARTS.AUTHOR)
    const collections = searchParams.getAll(BROWSE_PARTS.COLLECTION)

    const [input, setInput] = React.useState('')
    const [value, setValue] = React.useState<IOption|null>(null)

    const handleInput = (event: React.ChangeEvent<{}>, newInputValue: string) => {
        setInput(newInputValue)
    }


    React.useEffect(() => {
        cardStore.querryFindBuilder.setCriterion('steam.author.title', authors.length > 0 ? {$in: authors} : null)
        cardStore.querryFindBuilder.setCriterion('steam.collections.title', collections.length > 0 ? {$in: collections} : null)
        updateUrlParams(searchParams.get(BROWSE_PARTS.SEARCH))
    }, [])

    const updateUrlParams = (newSearch: string | null) => {
        cardStore.querryFindBuilder.replaceSearch(newSearch ?? undefined)
        setValue(newSearch ? {type: OPTION_TYPE.OTHER, value: newSearch} : null)
        setInput('')

        const newAuthors = (cardStore.querryFindBuilder.getCriterion('steam.author.title')?.$in ?? []) as string[]
        const newCollections = (cardStore.querryFindBuilder.getCriterion('steam.collections.title')?.$in ?? []) as string[]
        const newSearchParams = new URLSearchParams(routerStore.location.search)
        newSearchParams.delete(BROWSE_PARTS.AUTHOR)
        newSearchParams.delete(BROWSE_PARTS.COLLECTION)
        for(const newAuthor of newAuthors) newSearchParams.append(BROWSE_PARTS.AUTHOR, newAuthor)
        for(const newCollection of newCollections) newSearchParams.append(BROWSE_PARTS.COLLECTION, newCollection)
        if(newSearch === null) {
            newSearchParams.delete(BROWSE_PARTS.SEARCH)
        } else {
            newSearchParams.set(BROWSE_PARTS.SEARCH, newSearch)
        }
        routerStore.push({pathname: ROUTE.BROWSE, search: newSearchParams.toString()})
    }

    const handleChange = (event: React.ChangeEvent<{}>, newValue: IOption | string | null) => {
        if(newValue === null) {
            updateUrlParams(null)
        } else if(typeof newValue === 'string') {  // Pressed ENTER and so we receive plain string.
            updateUrlParams(newValue)
        } else if(newValue.type === OPTION_TYPE.AUTHOR || newValue.subtype === OPTION_TYPE.AUTHOR) {
            cardStore.querryFindBuilder.setCriterion('steam.author.title', {$in: [...authors, newValue.value]})
            updateUrlParams(null)
        } else if(newValue.type === OPTION_TYPE.COLLECTION || newValue.subtype === OPTION_TYPE.COLLECTION) {
            cardStore.querryFindBuilder.setCriterion('steam.collections.title', {$in: [...collections, newValue.value]})
            updateUrlParams(null)
        } else if(newValue.type === OPTION_TYPE.OTHER) {
            updateUrlParams(newValue.value)
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
        updateUrlParams(input !== '' ? input : null)
    }

    return (
        <Autocomplete
            className={clsx(classes.root, className)}
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
            disableClearable
            options={AUTOCOMPLETE}
            getOptionLabel={(option: string | IOption) => {
                if (typeof option === 'string') return option  // Value selected with enter, right from the input

                return option.value
            }}
            getOptionDisabled={(option: IOption) => {
                return authors.includes(option.value) || collections.includes(option.value)
            }}
            ListboxComponent={ListboxComponent as React.ComponentType<React.HTMLAttributes<HTMLElement>>}
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
                    placeholder='Search blueprints ...'
                    variant='outlined'
                    fullWidth
                    InputProps={{
                        ...params.InputProps,
                        className: clsx(params.InputProps.className, classes.input),
                        classes: {
                            input: classes.inputInput
                        },
                        startAdornment: [
                            (<InputAdornment key='icon' position='start' className={classes.inputAdornment}>
                                <IconBrowse color='primary' fontSize='default' />
                            </InputAdornment>),
                            ...authors.map((author: string, index: number) => (
                                <Chip
                                    className={classes.chip}
                                    icon={<IconPerson />}
                                    key={author}
                                    label={author}
                                    onDelete={HandleDelete({type: OPTION_TYPE.AUTHOR, value: author})}
                                />
                            )),
                            ...collections.map((collection: string, index: number) => (
                                <Chip
                                    className={classes.chip}
                                    icon={<IconCollection />}
                                    key={collection}
                                    label={collection}
                                    onDelete={HandleDelete({type: OPTION_TYPE.COLLECTION, value: collection})}
                                />
                            )),
                        ],
                    }}
                />
            )}
            {...otherProps}
        />
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
