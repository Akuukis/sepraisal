import clsx from 'clsx'
import deep from 'fast-deep-equal'
import { action, runInAction } from 'mobx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Card, CardContent, CardHeader, CardProps, Chip, TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import IconBrowse from 'src/components/icons/IconBrowse'
import { CONTEXT } from 'src/stores'



const styles = (theme: IMyTheme) => createStyles({
    root: {
        borderStyle: `solid`,
        borderWidth: 1,
        borderColor: theme.palette.text.secondary,
    },

    content: {
        padding: theme.spacing(1, 2),
        textAlign: 'right',
        '&:last-child': {
            paddingBottom: theme.spacing(4),
        }
    },
    header: {
        borderBottomStyle: `solid`,
        borderBottomWidth: 1,
        borderBottomColor: theme.palette.text.secondary,
        padding: theme.spacing(2),
        backgroundColor: theme.palette.success.light,
    },
    title: {
        ...theme.typography.subtitle2,
    },
    icon: {
        verticalAlign: 'text-bottom',
    },
    textField: {
    },
    input: {
        backgroundColor: theme.palette.background.paper,
    },
    chip: {
        margin: theme.spacing(0.5),
        backgroundColor: theme.palette.success.light,
    },
    headerExcludeVariant: {
        backgroundColor: theme.palette.error.light,
    },
    chipExcludeVariant: {
        backgroundColor: theme.palette.error.light,
    },
})

interface IProps extends Omit<CardProps, 'variant'> {
    heading: string
    variant: 'include' | 'exclude'
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {heading, className, variant, ...otherProps} = props
    const cardStore = React.useContext(CONTEXT.CARDS)
    const praisalManager = React.useContext(CONTEXT.PRAISAL_MANAGER)
    const formGroupScope = React.useContext(CONTEXT.FORM_GROUP_SCOPE)
    const cubeFullTypes = [...praisalManager.cubes.keys()]

    const options = cubeFullTypes
        .filter((fullType) => !fullType.includes('Debug'))
        .map(fullTypeToOption)

    const $exists = variant === 'include'

    const filtered = cardStore.querryFindBuilder.find.$and
            .map((criteria: object) => {
                const key = Object.keys(criteria).pop()!
                if(!key) throw Error('catch me')

                const fullType = key.match(/sbc\.blocks\.(.*)/)?.[1]
                return [fullType, criteria[key] as object] as const
            })
            .filter((pair): pair is [string, object] => !!pair[0])

    const disabled = filtered
            .filter(([_, value]) => deep(value, {$exists: !$exists}))
            .map(([fullType]) => fullTypeToOption(fullType))

    const selected = filtered
            .filter(([_, value]) => deep(value, {$exists}))
            .map(([fullType]) => fullTypeToOption(fullType))

    runInAction(() => {
        for(const fullType of selected) {
            formGroupScope.set(`sbc.blocks.${fullType}`, undefined)
        }
        // Don't bother removing them at next re-render, it's ok.
    })

    const title = (<>
        <IconBrowse className={classes.icon} />
        {heading}
    </>)

    const handleChange = action((event: React.ChangeEvent<{}>, options: IOption[]) => {
        for(const fullType of [...selected, ...options.map(({fullType})=>fullType)]) {
            const newValue = options.some((option) => option.fullType === fullType) ? {$exists} : null
            cardStore.querryFindBuilder.setCriterion(`sbc.blocks.${fullType}`, newValue)
            formGroupScope.set(`sbc.blocks.${fullType}`, undefined)
        }
    })

    const handleRemove = action((event: React.SyntheticEvent<Element, Event>) => {
        const shortType = event.currentTarget.parentElement!.innerText
        const option = options.find((option) => option.shortType === shortType)!
        cardStore.querryFindBuilder.setCriterion(`sbc.blocks.${option.fullType}`, null)
        formGroupScope.set(`sbc.blocks.${option.fullType}`, undefined)
    })

    return (
        <Card className={clsx(classes.root, className)} {...otherProps}>
            <CardHeader
                title={title}
                classes={{
                    root: clsx(classes.header, variant === 'exclude' && classes.headerExcludeVariant),
                    title: classes.title
                }}
            />
            <CardContent className={classes.content}>
                <Autocomplete
                    multiple
                    value={selected}
                    onChange={handleChange}
                    id='tags-filled'
                    disableCloseOnSelect
                    options={options}
                    getOptionSelected={(option: IOption, value: IOption) => selected.some(({fullType}) => fullType === option.fullType)}
                    getOptionDisabled={(option: IOption) => disabled.some(({fullType}) => fullType === option.fullType)}
                    getOptionLabel={(option: IOption) => option.shortType}
                    renderTags={(value: IOption[])=>null}
                    renderInput={(params) => (
                        <TextField
                            color='secondary'
                            className={classes.textField}
                            {...params}
                            variant='outlined'
                            placeholder='Select ID of blocks ...'
                        />
                    )}
                />
            </CardContent>
            <CardContent className={classes.content}>
                {selected.map((option: IOption, index: number) => (
                    <Chip
                        id={option.fullType}
                        variant='outlined'
                        size='small'
                        label={option.shortType}
                        className={clsx(classes.chip, variant === 'exclude' && classes.chipExcludeVariant)}
                        onDelete={handleRemove}
                    />
                ))}
            </CardContent>
        </Card>
    )
})) /* ============================================================================================================= */

const fullToShortType = (fullType: string) => {
    const [type, subtype] = fullType.split('/')
    return subtype || type
}

interface IOption {
    fullType: string
    shortType: string
}

const fullTypeToOption = (fullType: string): IOption => ({
    fullType,
    shortType: fullToShortType(fullType),
})
