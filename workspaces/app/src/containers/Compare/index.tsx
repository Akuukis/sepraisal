import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import IconCompare from 'src/components/icons/IconCompare'
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


    return (
        <DefaultLayout
            aside={<Panel />}
            asideIcon={<IconCompare />}
            asideTitle='Compare'
            className={classes.root}
        >
            <Columns />
        </DefaultLayout>
    )
})) /* ============================================================================================================= */
