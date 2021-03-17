import clsx from 'clsx'
import { autorun } from 'mobx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Chip, InputAdornment, TextField } from '@material-ui/core'
import Autocomplete, { AutocompleteProps, createFilterOptions } from '@material-ui/lab/Autocomplete'

import { createSmartFC, createStyles, IMyTheme, useAsyncEffectOnce } from 'src/common'
import IconBrowse from 'src/components/icons/IconBrowse'
import IconCollection from 'src/components/icons/IconCollection'
import IconPerson from 'src/components/icons/IconPerson'
import { BROWSE_PARTS, PROVIDER, ROUTE } from 'src/constants'
import { CONTEXT } from 'src/stores'

import AUTOCOMPLETE_AUTHORS from '../../../static/authors.data'
import AUTOCOMPLETE_COLLECTIONS from '../../../static/collections.data'
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
    const [options, setOptions] = React.useState<IOption[]>([])

    const searchParams = new URLSearchParams(routerStore.location.search)
    const authors = searchParams.getAll(BROWSE_PARTS.AUTHOR)
    const collections = searchParams.getAll(BROWSE_PARTS.COLLECTION)

    const [input, setInput] = React.useState('')
    const [value, setValue] = React.useState<IOption|null>(null)

    // eslint-disable-next-line @typescript-eslint/ban-types
    const handleInput = (event: React.ChangeEvent<{}>, newInputValue: string) => {
        setInput(newInputValue)
    }

    useAsyncEffectOnce(async () => {
        const [authors, collections] = await Promise.all([
            fetch(AUTOCOMPLETE_AUTHORS)
                .then((req) => req.json() as Promise<IOption[]>)
                .then((authorsRaw): IOption[] => authorsRaw.map<IOption>((entry) => ({type: OPTION_TYPE.AUTHOR, ...entry}))),
            fetch(AUTOCOMPLETE_COLLECTIONS)
                .then((req) => req.json() as Promise<IOption[]>)
                .then((collectionsRaw): IOption[] => collectionsRaw.map<IOption>((entry) => ({type: OPTION_TYPE.COLLECTION, ...entry}))),
        ])

        setOptions([
            ...authors,
            ...collections,
        ])
    })

    const setCriterion = (authors: string[], collections: string[]) => {
        if(authors.length === 0 && collections.length === 0) {
            cardStore.querryFindBuilder.setCriterion(CRITERIA_ID, null)
        } else {
            cardStore.querryFindBuilder.setCriterion(CRITERIA_ID, [
                {'steam.authors.title': {$in: authors}},
                {'steam.collections.title': {$in: collections}},
            ])
        }
    }

    React.useEffect(() => autorun(() => {
        setCriterion(authors, collections)
        const oldSearch = (new URLSearchParams(document.location.search)).get(BROWSE_PARTS.SEARCH)
        const newSearch = (new URLSearchParams(routerStore.location.search)).get(BROWSE_PARTS.SEARCH)
        if(newSearch === oldSearch && newSearch === value?.value) return

        cardStore.querryFindBuilder.replaceSearch(newSearch ?? undefined)
        setValue(newSearch ? {type: OPTION_TYPE.OTHER, value: newSearch} : null)
    }))

    const updateUrlParams = (newSearch: string | null) => {
        cardStore.querryFindBuilder.replaceSearch(newSearch ?? undefined)
        setValue(newSearch ? {type: OPTION_TYPE.OTHER, value: newSearch} : null)
        setInput('')

        const criterion = cardStore.querryFindBuilder.getCriterion<IMyFindCriterionGroup>(CRITERIA_ID)
        const newAuthors = criterion?.[0]['steam.authors.title'].$in ?? [] as string[]
        const newCollections = criterion?.[1]['steam.collections.title'].$in ?? [] as string[]
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
        routerStore.goLocation({pathname: ROUTE.BROWSE, search: newSearchParams.toString()})
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    const handleChange = (event: React.ChangeEvent<{}>, newValue: IOption | string | null) => {
        // Backspaced whole search text.
        if(newValue === null) {
            return updateUrlParams(null)
        }

        // Pressed ENTER and so we receive plain string.
        if(typeof newValue === 'string') {

            // Allow to short-circuit to analysis.
            const id = isThisSteamUrlOrID(newValue)
            if(id) return routerStore.goView(`${ROUTE.ANALYSE}?${PROVIDER.STEAM}=${id}`)

            return updateUrlParams(newValue)
        }

        // Selected either author, collection of other from the dropdown.
        if(typeof newValue === 'object') {
            const type = (newValue.type !== OPTION_TYPE.OTHER || newValue.subtype === 'Anywhere by')
                ? newValue.type
                : newValue.subtype

            switch(type) {
                case(OPTION_TYPE.AUTHOR): {
                    setCriterion([...authors, newValue.value], collections)
                    return updateUrlParams(null)
                }
                case(OPTION_TYPE.COLLECTION): {
                    setCriterion(authors, [...collections, newValue.value])
                    return updateUrlParams(null)
                }
                case(OPTION_TYPE.OTHER): {
                    return updateUrlParams(newValue.value)
                }
                default: throw new Error('catch me')
            }
        }

        throw new Error('catch me')
    }

    // eslint-disable-next-line @typescript-eslint/ban-types
    const handlePaste = (event: React.ClipboardEvent<{}>) => {
        // Allow to short-circuit to analysis.
        const id = isThisSteamUrlOrID(event.clipboardData.getData('text'))
        if(id) return routerStore.goView(`${ROUTE.ANALYSE}?${PROVIDER.STEAM}=${id}`)
    }

    const HandleDelete = (option: IOption) => () => {
        let newAuthors: string[] = authors
        let newCollections: string[] = collections
        if(option.type === OPTION_TYPE.AUTHOR) {
            newAuthors = authors.filter((author) => author !== option.value)
        } else if(option.type === OPTION_TYPE.COLLECTION) {
            newCollections = collections.filter((collection) => collection !== option.value)
        } else {
            throw new Error('catch me')
        }
        setCriterion(newAuthors, newCollections)
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
            onPaste={handlePaste}
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
            options={options}
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

const CRITERIA_ID = [
    'steam.authors.title',
    'steam.collections.title',
]
type IMyFindCriterionGroup = [
    {'steam.authors.title': {$in: string[] }},
    {'steam.collections.title': {$in: string[] }},
]

const isThisSteamUrlOrID = (text: string): null | number => {
    let id: number | null = null
    try {
        id = Number(new URL(text).searchParams.get('id'))
    } catch(err) {
        // Do nothing.
    }

    if(!id) {
        const maybeId = Math.round(Number(text))
        if(text === maybeId.toString()) id = maybeId
    }

    if(id && id.toString().length >= 9 && id.toString().length <= 10) {
        return id
    } else {
        return null
    }
}
