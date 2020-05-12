import deep from 'fast-deep-equal'
import { action, runInAction } from 'mobx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Checkbox, FormControlLabel } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import { FindCriterion, FindCriterionDirect, QueryFindBuilder } from 'src/models'
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
})


interface IProps {
    criterionId: string | string[],
    no?: FindCriterionDirect,
    title: string,
    yes: FindCriterionDirect,
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {title, criterionId, yes, no} = props
    const piwikStore = React.useContext(CONTEXT.PIWIK)
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

    const getCriteria = (state: boolean | null): FindCriterionDirect | null => {
        switch(state) {
            case(null): return null
            case(true): return yes
            case(false): return no!  // nextState() guards this would never happen.
            default: throw new Error('catch me')
        }
    }

    const criterion = cardStore.querryFindBuilder.getCriterion(criterionId)
    const state = inferState(criterion, yes, no)
    runInAction(() => formGroupScope.set(QueryFindBuilder.serializeId(criterionId), state !== null))

    const toggleChecked = action(() => {
        piwikStore.push([
            'trackEvent',
            'custom-filter',
            criterionId,
            JSON.stringify(nextState(state)),
        ])
        cardStore.querryFindBuilder.setCriterion(criterionId, getCriteria(nextState(state)))
    })

    return (
        <FormControlLabel
            control={
                <Checkbox
                    classes={{
                        root: classes.checkboxRoot,
                        indeterminate: classes.checkboxIndeterminate,
                    }}
                    color='primary'  // Applies when checked.
                    checked={state === true}
                    onChange={toggleChecked}
                    value={criterionId}
                    indeterminate={state === null}
                />
            }
            label={title}
            style={state === null ? {color: theme.palette.text.disabled} : {}}
        />
    )
})) /* ============================================================================================================= */

const inferState = (criterion: FindCriterion | null, yes: FindCriterionDirect, no?: FindCriterionDirect): boolean | null => {
    if(!criterion) return null

    if(QueryFindBuilder.isCriterionDirect(criterion)) {
        if(deep(criterion, yes)) return true
        if(no && deep(criterion, no)) return false
    } else {
        if(criterion.every((subCriterion) => deep(Object.values(subCriterion).pop(), yes))) return true
        if(no && criterion.every((subCriterion) => deep(Object.values(subCriterion).pop(), no))) return false
    }

    // If it doesn't match anything expected, then user has added different filter for this key.
    return null
}
