import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Avatar } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../../common/'
import CenterCell from '../../../components/Cell/CenterCell'
import ValueCell from '../../../components/Cell/ValueCell'
import MyBox from '../../../components/MyBox'
import MyBoxColumn from '../../../components/MyBoxColumn'
import { CardStatus, ICard } from '../../../models/Card'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        minWidth: '0px',  // Shrink if name too long.
        paddingBottom: theme.spacing(1),
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
        paddingTop: theme.spacing(1),
    },
})


interface IProps {
    id: number
    steam: ICard<CardStatus>['steam']
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {id, steam} = props

    const avatarTitle = steam?.author.title?.slice(0, 2) ?? '??'
    const title = steam?.title ?? String(id)
    const subheader = steam !== null
        ? (steam.collections.length > 0 ? steam.collections[0].title : '-')
        : 'Analysis in progress...'

    return (
        <MyBoxColumn width={6}>
            <MyBox width={6} variant='flat'>
                <CenterCell width={1.5}>
                    <Avatar>{avatarTitle}</Avatar>
                </CenterCell>
                <ValueCell width={4.5} label={subheader} value={title} alignItems='flex-start' />
            </MyBox>
        </MyBoxColumn>
    )
})) /* ============================================================================================================= */
