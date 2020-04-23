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
    const [open, setOpen] = React.useState(true)

    const toggleDrawer = () => setOpen(!open)

    const aside = (
        <Filters
            toggleDrawer={toggleDrawer}
        />
    )

    return (
        <DefaultLayout aside={aside} asideProps={{open}} className={classes.root}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Search toggleDrawer={toggleDrawer} />
                </Grid>
            </Grid>
            <Pages />
        </DefaultLayout>
    )
})) /* ============================================================================================================= */


const drawerWidth = 360
