import clsx from 'clsx'
import deep from 'fast-deep-equal'
import { action } from 'mobx'
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
    const cubeNames = [...praisalManager.cubes.keys()]

    const $exists = variant === 'include'

    const filtered = cardStore.find.$and
            .map((criteria: object) => {
                const key = Object.keys(criteria).pop()!
                if(!key) throw Error('catch me')

                const fullId = key.split('.')[2]
                return [fullId, criteria[key] as object] as const
            })
            .filter(([key, value]) => !!key)

    const disabled = filtered
            .filter(([fullId, value]) => deep(value, {$exists: !$exists}))
            .map(([fullId]) => fullId)

    const enabled = filtered
            .filter(([fullId, value]) => deep(value, {$exists}))
            .map(([fullId]) => fullId)

    const title = (<>
        <IconBrowse className={classes.icon} />
        {heading}
    </>)

    const handleChange = action((event: React.ChangeEvent<{}>, values: string[]) => {
        let $and = [...cardStore.find.$and]
        for(const value of [...enabled, ...values]) {
            const index = $and.findIndex((criteria) => {
                const key = Object.keys(criteria).pop()!
                if(!key) throw Error('catch me')

                const fullId = key.split('.')[2]
                return fullId === value
            })
            const newCriteriaWrapped = values.includes(value) ? [{[`sbc.blocks.${value}`]: {$exists}}] : []

            $and = [
                ...$and.slice(0, Math.max(0, index)),
                ...newCriteriaWrapped,
                ...$and.slice(index + 1, $and.length),
            ]
        }
        cardStore.setFind({$and})
    })

    const handleRemove = (event: React.SyntheticEvent<any, Event>) => {
        const id = event.currentTarget.parentElement.innerText

        const index = cardStore.find.$and.findIndex((criteria) => {
            const key = Object.keys(criteria).pop()!
            if(!key) throw Error('catch me')

            const fullId = key.split('.')[2]
            return fullId === id
        })

        cardStore.setFind({$and: [
            ...cardStore.find.$and.slice(0, Math.max(0, index)),
            ...cardStore.find.$and.slice(index + 1, cardStore.find.$and.length),
        ]})
    }

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
                    value={enabled}
                    onChange={handleChange}
                    id='tags-filled'
                    disableCloseOnSelect
                    options={cubeNames}
                    getOptionSelected={(option: string, value: string) => value === option}
                    getOptionDisabled={(option: string) => disabled.includes(option)}
                    renderTags={(value: string[])=>null}
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
                {enabled.map((id: string, index: number) => (
                    <Chip
                        variant='outlined'
                        key={id}
                        size='small'
                        label={id}
                        className={clsx(classes.chip, variant === 'exclude' && classes.chipExcludeVariant)}
                        onDelete={handleRemove}
                    />
                ))}
            </CardContent>
        </Card>
    )
})) /* ============================================================================================================= */
