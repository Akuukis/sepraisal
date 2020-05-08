import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { createSmartFC, createStyles, formatDecimal, IMyTheme, padTo2 } from 'src/common'

import ValueCell from '../../../components/Cell/ValueCell'
import MyBox from '../../../components/MyBox'
import MyBoxColumn from '../../../components/MyBoxColumn'
import MyBoxRow from '../../../components/MyBoxRow'
import { CardStatus, ICard } from '../../../models/Card'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },
    box: {
        backgroundColor: theme.palette.success.main,
    },
    ValueCellLabel: {
        color: theme.palette.success.light,
    },
    ValueCellValue: {
        fontWeight: 500,
        color: theme.palette.success.contrastText,
    },
})


interface IProps {
    id: number
    card: ICard<CardStatus>
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {id, card} = props
    const {sbc, steam} = card

    if(!sbc) {
        // TODO
        return null
    }

    const updatedDate = `${steam!.updatedDate.getUTCFullYear()}-${padTo2(steam!.updatedDate.getMonth() + 1)}`
    const classesValueCell = {
        label: classes.ValueCellLabel,
        value: classes.ValueCellValue,
    }

    return (
        <MyBoxColumn className={classes.root}>
            <MyBoxRow>
                <MyBox width={4} classes={{paper: classes.box}}>
                    <ValueCell classes={classesValueCell} width={1} label='updated' value={updatedDate} />
                    <ValueCell classes={classesValueCell} width={1} label={`PCU`} value={formatDecimal(sbc.blockPCU)} />
                    <ValueCell classes={classesValueCell} width={1} label={`mass (kg)`} value={formatDecimal(sbc.blockMass)} />
                    <ValueCell classes={classesValueCell} width={1} label={`${sbc.gridSize.slice(0, 1)}-blocks`} value={formatDecimal(sbc.blockCount)} />
                </MyBox>
            </MyBoxRow>
        </MyBoxColumn>
    )
})) /* ============================================================================================================= */
