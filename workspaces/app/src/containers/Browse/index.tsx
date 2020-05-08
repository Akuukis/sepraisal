import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import DefaultLayout from 'src/layouts/DefaultLayout'

import Cards from './Cards'
import Filters from './Filters'
import LoadMore from './LoadMore'
import Search from './Search'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {

    return (
        <DefaultLayout className={classes.root} aside={<Filters />} asideTitle='Filters'>
            <Search />
            <Cards />
            <LoadMore />
        </DefaultLayout>
    )
})) /* ============================================================================================================= */


const drawerWidth = 360
