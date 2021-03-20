import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import IconFilter from 'src/components/icons/IconFilter'

import Basics from './Basics'
import BlockGroups from './BlockGroups'
import Blocks from './Blocks'
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

    return (
        <>
            <Basics         classes={{root: classes.root, legend: classes.legend}} icon={<IconFilter />} />
            <MetaSteam      classes={{root: classes.root, legend: classes.legend}} icon={<IconFilter />} />
            <Performance    classes={{root: classes.root, legend: classes.legend}} icon={<IconFilter />} />
            <Size           classes={{root: classes.root, legend: classes.legend}} icon={<IconFilter />} />
            <BlockGroups    classes={{root: classes.root, legend: classes.legend}} icon={<IconFilter />} />
            <Blocks         classes={{root: classes.root, legend: classes.legend}} icon={<IconFilter />} />
        </>
    )
})) /* ============================================================================================================= */
