import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../common/'
import DefaultLayout from '../../layouts/DefaultLayout'
import Filters from './Filters'
import Pages from './Pages'
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
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Search />
                </Grid>
            </Grid>
            <Pages />
        </DefaultLayout>
    )
})) /* ============================================================================================================= */


const drawerWidth = 360
