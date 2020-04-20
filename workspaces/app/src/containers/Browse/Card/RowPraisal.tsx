import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { CardContent, Grid } from '@material-ui/core'

import { createSmartFC, createStyles, formatDecimal, IMyTheme } from '../../../common/'
import ValueCell from '../../../components/Cell/ValueCell'
import { CardStatus, ICard } from '../../../models/Card'
import MyRow from '../../../components/MyRow'


const styles = (theme: IMyTheme) => createStyles({
    root: {
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
        label: `${sbc.gridSize.slice(0, 1)}-blocks`,
        value: formatDecimal(sbc.blockCount),
    }
    const ore = formatDecimal(sbc.oreVolume / 1000)
    const workhours = formatDecimal((sbc.blockTime + sbc.componentTime + sbc.ingotTime) / 60 / 60, 1)

    return (
        <MyRow className={classes.root}>
            <ValueCell label={`PCU`} value={pcu} />
            <ValueCell {...grid} />
            <ValueCell label={`ore (m\u00B3)`} value={ore} />
            <ValueCell label={`workhours`} value={workhours} />
        </MyRow>
    )
})) /* ============================================================================================================= */
