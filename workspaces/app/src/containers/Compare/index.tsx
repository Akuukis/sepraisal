import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { useMediaQuery } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import IconCompare from 'src/components/icons/IconCompare'
import TooSmallWidth from 'src/components/TooSmallWidth'
import DefaultLayout from 'src/layouts/DefaultLayout'

import Columns from './Columns'
import Panel from './Panel'

const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const smUp = useMediaQuery(theme.breakpoints.up('sm'), { noSsr: true })

    return (
        <DefaultLayout
            aside={<Panel />}
            asideIcon={<IconCompare />}
            asideTitle='Compare'
            className={classes.root}
        >
            {smUp ? <Columns /> : <TooSmallWidth />}
        </DefaultLayout>
    )
})) /* ============================================================================================================= */
