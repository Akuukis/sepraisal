import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { CardContent, Grid } from '@material-ui/core'

import { createSmartFC, createStyles, formatDecimal, IMyTheme } from '../../../common/'
import KeyValueBox from '../../../components/KeyValueBox'
import { CardStatus, ICard } from '../../../models/Card'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        paddingBottom: theme.spacing(1),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingTop: theme.spacing(1),
    },
})


interface IProps {
    id: number
    sbc: ICard<CardStatus>['sbc']
}


export default hot(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {
    const {id, sbc} = props

    if(!sbc) {
        // TODO
        return null
    }

    const pcu = formatDecimal(sbc.blockPCU)
    const grid = {
        def: `${sbc.gridSize.slice(0, 1)}-blocks`,
        value: formatDecimal(sbc.blockCount),
    }
    const ore = formatDecimal(sbc.oreVolume / 1000)
    const workhours = formatDecimal((sbc.blockTime + sbc.componentTime + sbc.ingotTime) / 60 / 60, 1)

    return (
        <CardContent className={classes.root}>
            <Grid container spacing={0}>
                <KeyValueBox def={`PCU`} value={pcu} />
                <KeyValueBox {...grid} />
                <KeyValueBox def={`ore (m\u00B3)`} value={ore} />
                <KeyValueBox def={`workhours`} value={workhours} />
            </Grid>
        </CardContent>
    )
})) /* ============================================================================================================= */
