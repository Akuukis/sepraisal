import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Link } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme, linkCollectionProps } from '../../../common/'
import CenterCell from '../../../components/Cell/CenterCell'
import ValueCell from '../../../components/Cell/ValueCell'
import MyBox from '../../../components/MyBox'
import MyBoxColumn from '../../../components/MyBoxColumn'
import MyBoxRow from '../../../components/MyBoxRow'
import { CardStatus, ICard } from '../../../models/Card'
import SteamBadge from './SteamBadge'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        paddingTop: theme.spacing(1),
    },

    box: {
        paddingLeft: theme.spacing(1),
        // paddingTop: theme.spacing(1),
    },
    collection: {
        color: theme.palette.success.contrastText,
    },
    CenterCell: {
        padding: theme.spacing(0),
        flexGrow: 0,
        flexShrink: 0,
        flexBasis: 'content',
    },
    ValueCell: {
        flexGrow: 1,
        flexShrink: 0,
        flexBasis: 0,
    },
    ValueCellLabel: {
        color: theme.palette.success.light,
    },
    ValueCellValue: {
        fontWeight: 500,
        color: theme.palette.success.contrastText,
        // height: `calc(${theme.typography.body1.fontSize} * 2.5)`,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        '-webkit-line-clamp': 2,
        '-webkit-box-orient': 'vertical',
        textAlign: 'left',
        whiteSpace: 'unset',
    },
})


interface IProps {
    id: number
    steam: ICard<CardStatus>['steam']
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {id, steam} = props

    const title = steam?.title ?? String(id)
    const subheader = steam === null ? 'Analysis in progress...' : steam.collections.length > 0
        ?
            (<Link className={classes.collection} variant='caption' noWrap {...linkCollectionProps(steam.collections[0].id)}>
                {steam.collections[0].title ?? steam.collections[0].id}
            </Link>)
        :
            '-'

    return (
        <MyBoxColumn height={1.33} className={classes.root}>
            <MyBoxRow height={1.33}>
                <MyBox width={4} variant='flat' className={classes.box}>
                    <ValueCell
                        classes={{
                            root: classes.ValueCell,
                            label: classes.ValueCellLabel,
                            value: classes.ValueCellValue,
                        }}
                        width={4}
                        label={subheader}
                        value={title}
                        alignItems='flex-start'
                        justify='space-between'
                    />
                    <CenterCell
                        className={classes.CenterCell}
                        width={4}
                        alignItems='flex-start'
                        justify='flex-end'
                    >
                        <SteamBadge id={id} amount={steam?.subscriberCount!} />
                    </CenterCell>
                </MyBox>
            </MyBoxRow>
        </MyBoxColumn>
    )
})) /* ============================================================================================================= */
