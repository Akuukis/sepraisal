import { IBlueprint } from '@sepraisal/common'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme, STEAM_COLORS } from '../../common/'
import MyBox from '../MyBox'
import MyBoxColumn from '../MyBoxColumn'
import MyBoxRow from '../MyBoxRow'
import MySectionInner from './MySectionInner'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        // backgroundColor: 'unset',
    },
    box: {
        padding: 0,
    },

    description: {
        paddingBottom: theme.spacing(2),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingTop: theme.spacing(2),
        color: STEAM_COLORS.white,
        backgroundColor: STEAM_COLORS.blue,
        '& > img': {
            maxWidth: `calc(100% - ${theme.spacing(4)}px)`,
        },
        height: `calc(100% - ${theme.spacing(2) * 2}px)`,
        width: `calc(100% - ${theme.spacing(2) * 2}px)`,
        overflowX: 'hidden',
        overflowY: 'scroll',
    },
})


interface IProps {
    bp: IBpProjectionRow
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {bp} = props

    return (
        <MySectionInner
            className={classes.root}
            heading='Workshop description'
            label='-'
            value='-'
            MyBoxColumnProps={{style: {display: 'none'}}}
        >
            <MyBoxColumn height={4} width={6}>
                <MyBoxRow height={4} width={6}>
                    <MyBox width={6} className={classes.box}>
                        <Typography className={classes.description} variant='body1' dangerouslySetInnerHTML={{ __html: bp.steam.description}} />
                    </MyBox>
                </MyBoxRow>
            </MyBoxColumn>
        </MySectionInner>
    )
})) /* ============================================================================================================= */


type ProjectionCardSteam =
    | 'description'

interface IBpProjectionRow {
    steam: {[key in keyof Pick<IBlueprint.ISteam, ProjectionCardSteam>]: IBlueprint.ISteam[key]}
}
