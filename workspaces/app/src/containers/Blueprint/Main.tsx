import { idFromHref } from '@sepraisal/common'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'
import { useLocation } from 'react-router-dom'

import { Grid } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../common/'
import Analysis from '../../components/Analysis'
import { CONTEXT } from '../../stores'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const blueprintStore = React.useContext(CONTEXT.BLUEPRINTS)
    const location = useLocation()

    let content: React.ReactElement | null = null
    try {
        const id = idFromHref(location.search)
        if(blueprintStore.getSomething(id)) {
            content = <Analysis bpId={id} long />
        }
    } catch(err) {
    }

    return (
        <Grid container spacing={2} justify='center'>
            {content}
        </Grid>
    )
})) /* ============================================================================================================= */
