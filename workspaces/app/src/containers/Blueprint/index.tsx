import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { createSmartFC, createStyles, IMyTheme } from '../../common/'
import DefaultLayout from '../../layouts/DefaultLayout'
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
            asideTitle='Analyse'
        >
            <Main />
        </DefaultLayout>
    )
})) /* ============================================================================================================= */
