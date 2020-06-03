import clsx from 'clsx'
import deep from 'fast-deep-equal'
import { action, runInAction } from 'mobx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Checkbox, FormControlLabel, FormControlLabelProps } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import { QueryFindBuilder } from 'src/models'
import { CONTEXT } from 'src/stores'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },
    checkboxRoot: {
        color: theme.palette.primary.main,
    },
    checkboxIndeterminate: {
        color: theme.palette.text.secondary,
    },
    error: {
        color: `${theme.palette.error.main} !important`,
    }
})


interface IProps extends Omit<FormControlLabelProps, 'control'> {
    criterionIds: string[],
    label: string,
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {label, criterionIds, className, ...otherProps} = props
    const yes = {$exists: true}
    const no = {$exists: false}

    const analyticsStore = React.useContext(CONTEXT.ANALYTICS)
    const cardStore = React.useContext(CONTEXT.CARDS)
    const formGroupScope = React.useContext(CONTEXT.FORM_GROUP_SCOPE)

    const nextState = (state: boolean | null) => {
        switch(state) {
            case(null): return true
            case(true): return no ? false : null
            case(false): return null
            default: throw new Error('catch me')
        }
    }

    const criterionYes = cardStore.querryFindBuilder.getCriterion(criterionIds)
    const isYes = criterionYes && criterionYes.every((subCriterion) => deep(Object.values(subCriterion).pop(), yes))
    const isNo = criterionIds.every((criterionId) => cardStore.querryFindBuilder.getCriterion(criterionId))

    const state = isYes ? true : isNo ? false : null
    const isError = isYes && isNo

    runInAction(() => formGroupScope.set(QueryFindBuilder.serializeId(criterionIds), state !== null))

    const toggleChecked = action(() => {
        analyticsStore.trackEvent('custom-filter', criterionIds.join(','), JSON.stringify(nextState(state)))

        switch(state) {
            case(true): {
                cardStore.querryFindBuilder.setCriterion(criterionIds, null)
                break
            }
            case(false): {
                criterionIds.forEach((criterionId) => cardStore.querryFindBuilder.setCriterion(criterionId, null))
                break
            }
            case(null): {
                /* Nothing */
            }
        }

        switch(nextState(state)) {
            case(true): {
                cardStore.querryFindBuilder.setCriterion(criterionIds, yes)
                break
            }
            case(false): {
                criterionIds.forEach((criterionId) => cardStore.querryFindBuilder.setCriterion(criterionId, no))
                break
            }
            case(null): {
                /* Nothing */
            }
        }
    })

    return (
        <FormControlLabel
            control={
                <Checkbox
                    classes={{
                        root: clsx(classes.checkboxRoot, isError && classes.error),
                        indeterminate: classes.checkboxIndeterminate,
                    }}
                    color='primary'  // Applies when checked.
                    checked={state === true}
                    onChange={toggleChecked}
                    value={criterionIds}
                    indeterminate={state === null}
                />
            }
            classes={{
                root: clsx(className, isError && classes.error),
            }}
            label={label}
            style={state === null ? {color: theme.palette.text.disabled} : {}}
            {...otherProps}
        />
    )
})) /* ============================================================================================================= */
