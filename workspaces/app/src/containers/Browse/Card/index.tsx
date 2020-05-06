import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Card } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../../common/'
import { CardStatus, ICard } from '../../../models/Card'
import { CONTEXT } from '../../../stores'
import Overlay from './Overlay'
import RowHeader from './RowHeader'
import RowPraisal from './RowPraisal'
import Thumb from './Thumb'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        backgroundColor: theme.palette.success.dark,
        'position': 'relative',
    },
})


interface IProps {
    blueprint: ICard<CardStatus>
    index: number
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {blueprint: card, index} = props

    return (
        <Card className={classes.root}>
            <CONTEXT.PARENT_COLUMNS.Provider value={{parentColumns: 12, maxWidth: 4}}>
                <Thumb id={card.id} thumb={card.thumb} />
                <RowHeader id={card.id} steam={card.steam} />
                <RowPraisal id={card.id} card={card} />
                <Overlay blueprint={card} index={index} />
            </CONTEXT.PARENT_COLUMNS.Provider>
        </Card>
    )
})) /* ============================================================================================================= */
