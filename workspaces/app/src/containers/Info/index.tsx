import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import DefaultLayout from 'src/layouts/DefaultLayout'

import Credits from './Credits'
import Faq from './Faq'
import Support from './Support'

const styles = (theme: IMyTheme) => createStyles({
    root: {
    },
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {

    return (
        <DefaultLayout className={classes.root}>
            <Grid container spacing={2} justify='center'>
                <Grid item xs={12} sm={10} md={8} lg={6}>
                    <Faq />
                </Grid>
                <Grid item xs={12} sm={10} md={4} lg={4}>
                    <Grid container spacing={2} justify='center'>
                        <Grid item xs={12}>
                            <Support />
                        </Grid>
                        <Grid item xs={12}>
                            <Credits />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </DefaultLayout>
    )
})) /* ============================================================================================================= */
