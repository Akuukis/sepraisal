import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import { CONTEXT } from 'src/stores'
import { CardStore } from 'src/stores/CardStore'

import Basics from './Basics'
import Blocks from './Blocks'
import Cost from './Cost'
import MetaSteam from './MetaSteam'
import Performance from './Performance'
import Size from './Size'

const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    legend: {
        ...theme.typography.subtitle2,
    },
})

interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const cardStore = React.useContext(CONTEXT.CARDS)

    return (
        <>
            <Basics         classes={{root: classes.root, legend: classes.legend}} />
            <MetaSteam      classes={{root: classes.root, legend: classes.legend}} />
            <Size           classes={{root: classes.root, legend: classes.legend}} />
            <Blocks         classes={{root: classes.root, legend: classes.legend}} />
            <Performance    classes={{root: classes.root, legend: classes.legend}} />
            <Cost           classes={{root: classes.root, legend: classes.legend}} />
        </>
    )
})) /* ============================================================================================================= */

const getTitle = (cardStore: CardStore) => {
    if(cardStore.selectedPreset !== 'custom') return ''

    const criteriaAmount = cardStore.find.$and.length - 2

    return `${criteriaAmount} criteria selected`
}
