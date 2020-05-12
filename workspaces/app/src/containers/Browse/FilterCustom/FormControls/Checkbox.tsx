import deep from 'fast-deep-equal'
import { action, runInAction } from 'mobx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Checkbox, FormControlLabel } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import { FindCriterionDirect } from 'src/models'
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
    criterionId: string,
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
    const checked = criterion ? deep(criterion, yes) : null
    runInAction(() => formGroupScope.set(criterionId, undefined))

    const toggleChecked = action(() => {
        piwikStore.push([
            'trackEvent',
            'custom-filter',
            criterionId,
            JSON.stringify(nextState(checked)),
        ])
        cardStore.querryFindBuilder.setCriterion(criterionId, getCriteria(nextState(checked)))
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
                    checked={checked === true}
                    onChange={toggleChecked}
                    value={criterionId}
                    indeterminate={checked === null}
                />
            }
            label={title}
            style={checked === null ? {color: theme.palette.text.disabled} : {}}
        />
    )
})) /* ============================================================================================================= */
