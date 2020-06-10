import * as React from 'react'
import { hot } from 'react-hot-loader/root'
import { useLocation } from 'react-router-dom'

import { Grid } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import Analysis from 'src/components/Analysis'
import NothingSelected from 'src/components/NothingSelected'
import { PROVIDER } from 'src/constants'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const location = useLocation()

    const urlParams = new URLSearchParams(location.search)
    let bpId: number | string | null = null

    // Try steam id.
    if(!bpId) {
        bpId = Number(urlParams.get(PROVIDER.STEAM))
        // if(bpId) console.debug(`Found steam id: "${bpId}"`)
    }

    // Try upload title.
    if(!bpId) {
        bpId = urlParams.get(PROVIDER.LOCAL)
        // if(bpId) console.debug(`Found upload id: "${bpId}"`)
    }

    React.useEffect(() => {
        if(bpId) {
            document.title = `Analyse - ${bpId}`
        } else {
            document.title = `Analyse`
        }
    })

    return (
        <Grid container spacing={2} justify='center'>
            {bpId !== null ? <Analysis bpId={bpId} key={bpId} long /> :  <NothingSelected />}
        </Grid>
    )
})) /* ============================================================================================================= */
