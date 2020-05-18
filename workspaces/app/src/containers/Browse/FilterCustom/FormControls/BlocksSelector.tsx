import clsx from 'clsx'
import deep from 'fast-deep-equal'
import { action, runInAction } from 'mobx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Chip, InputAdornment, TextField, Typography } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import IconBrowse from 'src/components/icons/IconBrowse'
import { CONTEXT } from 'src/stores'



const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    textField: {
    },
    chip: {
        margin: theme.spacing(0.5),
        backgroundColor: theme.palette.success.light,
    },
    chipExcludeVariant: {
        backgroundColor: theme.palette.error.light,
    },
    subheading: {
        margin: theme.spacing(2, 0, 0, 0),
    },
    chips: {
    },
    inputAdornment: {
        color: theme.palette.success.main,
    },
    inputAdornmentExcludeVariant: {
        color: theme.palette.error.main,
    },
})

interface IProps {
    heading: string
    variant: 'include' | 'exclude'
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {heading, variant} = props
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
        for(const option of selected) {
            formGroupScope.set(`sbc.blocks.${option.fullType}`, undefined)
        }
        // Don't bother removing them at next re-render, it's ok.
    })

    const handleChange = action((event: React.ChangeEvent<{}>, newOptions: IOption[]) => {
        // A lot of overwritting going on because that's cheaper than to identify exact change.
        // As it's within one action it doesn't trigger re-rerenders during the loop.
        for(const option of [...selected, ...newOptions]) {
            const {fullType} = option
            const newValue = newOptions.some((option) => option.fullType === fullType) ? {$exists} : null
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
        <div className={clsx(classes.root)}>
            <Typography component='legend' className={classes.subheading} variant='subtitle1' align='left'>
                {heading}
            </Typography>
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
                            InputProps={{
                                ...params.InputProps,
                                startAdornment: (
                                    <InputAdornment
                                        position='start'
                                        className={clsx(classes.inputAdornment, variant === 'exclude' && classes.inputAdornmentExcludeVariant)}
                                    >
                                        <IconBrowse color='inherit' fontSize='default' />
                                    </InputAdornment>
                                )
                            }}
                        />
                    )}
                />
            <div className={classes.chips}>
                {selected.map((option: IOption, index: number) => (
                    <Chip
                        id={option.fullType}
                        key={option.fullType}
                        size='small'
                        label={option.shortType}
                        className={clsx(classes.chip, variant === 'exclude' && classes.chipExcludeVariant)}
                        onDelete={handleRemove}
                    />
                ))}
            </div>
        </div>
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
