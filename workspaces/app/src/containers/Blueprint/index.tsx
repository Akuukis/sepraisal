import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../common/'
import Analysis from '../../components/Analysis'
import DefaultLayout from '../../layouts/DefaultLayout'
import { CONTEXT } from '../../stores'
import Panel from './Panel'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const routerStore = React.useContext(CONTEXT.ROUTER)

    const bpId = Number(routerStore.location.pathname.split('?')[0].split('/').pop() as string)

    return (
        <DefaultLayout
            className={classes.root}
            aside={<Panel />}
            asideTitle='Analyse'
        >
            <Grid container spacing={2} justify='center'>
                <Analysis bpId={bpId} long />
            </Grid>
        </DefaultLayout>
    )
})) /* ============================================================================================================= */
