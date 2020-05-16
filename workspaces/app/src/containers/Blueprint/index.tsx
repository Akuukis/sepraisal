import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import IconAnalyse from 'src/components/icons/IconAnalyse'
import DefaultLayout from 'src/layouts/DefaultLayout'

import Main from './Main'
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
            className={classes.root}
            aside={<Panel />}
            asideIcon={<IconAnalyse fontSize='default' />}
            asideTitle='Analyse'
        >
            <Main />
        </DefaultLayout>
    )
})) /* ============================================================================================================= */
