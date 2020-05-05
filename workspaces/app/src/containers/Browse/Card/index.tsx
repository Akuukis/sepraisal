import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Card } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme, SE_COLORS } from '../../../common/'
import { CardStatus, ICard } from '../../../models/Card'
import { CONTEXT } from '../../../stores'
import Overlay from './Overlay'
import RowHeader from './RowHeader'
import RowPraisal from './RowPraisal'
import RowSteam from './RowSteam'
import Thumb from './Thumb'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        'backgroundColor': SE_COLORS.white,
        'position': 'relative',
    },

    cardContent: {
        paddingBottom: theme.spacing(1),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingTop: theme.spacing(1),
    },
})


interface IProps {
    blueprint: ICard<CardStatus>
    index: number
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {blueprint: bp, index} = props

    return (
        <Card className={classes.root}>
            <CONTEXT.PARENT_COLUMNS.Provider value={{parentColumns: 12, maxWidth: 4}}>
                <Thumb id={bp.id} thumb={bp.thumb} />
                <RowHeader id={bp.id} steam={bp.steam} />
                <RowSteam classes={{root: classes.cardContent}} id={bp.id} steam={bp.steam} />
                <RowPraisal classes={{root: classes.cardContent}} id={bp.id} sbc={bp.sbc} />
                <Overlay blueprint={bp} index={index} />
            </CONTEXT.PARENT_COLUMNS.Provider>
        </Card>
    )
})) /* ============================================================================================================= */
