import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import { CONTEXT } from 'src/stores'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },
})

interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const formGroupScope = React.useContext(CONTEXT.FORM_GROUP_SCOPE)
    const cardStore = React.useContext(CONTEXT.CARDS)

    const active = [...formGroupScope.keys()]
        .map((id) => cardStore.querryFindBuilder.getCriterion(id))
        .filter((active) => !!active)
        .length

    console.log(formGroupScope.toJS())

    return (
        <>
            {active ? `${active} active filters` : ''}
        </>
    )
})) /* ============================================================================================================= */
