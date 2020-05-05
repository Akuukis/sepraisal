import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { createSmartFC, createStyles, formatDecimal, IMyTheme } from '../../../common/'
import ValueCell from '../../../components/Cell/ValueCell'
import MyBox from '../../../components/MyBox'
import MyBoxColumn from '../../../components/MyBoxColumn'
import { CardStatus, ICard } from '../../../models/Card'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },
})


interface IProps {
    id: number
    sbc: ICard<CardStatus>['sbc']
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
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
        <MyBoxColumn width={6}>
            <MyBox width={6}>
                <ValueCell width={1.5} label={`PCU`} value={pcu} />
                <ValueCell width={1.5} {...grid} />
                <ValueCell width={1.5} label={`ore (m\u00B3)`} value={ore} />
                <ValueCell width={1.5} label={`workhours`} value={workhours} />
            </MyBox>
        </MyBoxColumn>
    )
})) /* ============================================================================================================= */
