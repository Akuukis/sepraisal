import { IBlueprint } from '@sepraisal/common'
import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { IconButton, Paper, Typography, useMediaQuery } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme, linkBpProps, STEAM_COLORS } from '../../common/'
import Steam from '../icons/Steam'
import MyBox from '../MyBox'
import MyBoxColumn from '../MyBoxColumn'
import MyBoxRow from '../MyBoxRow'
import MySection from './MySection'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        // backgroundColor: 'unset',
        position: 'relative',
    },
    box: {
        padding: 0,
    },

    corner: {
        backgroundColor: theme.palette.background.default,
        color: 'black',
        position: 'absolute',
        right: 0,
        top: 0,
        paddingLeft: 25,
        paddingBottom: 25,
        clipPath: 'polygon(0 0, 100% 0%, 100% 100%)',
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
        overflowY: 'auto',
    },
})


interface IProps extends Omit<React.ComponentProps<typeof MySection>, 'heading' | 'value' | 'label'> {
    bp: IBpProjectionRow
    long?: boolean
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {bp, long, className, ...otherProps} = props
    const largerThanXl = useMediaQuery(theme.breakpoints.up('xl'))

    return (
        <MySection
            heading='Workshop description'
            label='-'
            value='-'
            MyBoxColumnProps={{style: {display: 'none'}}}
            className={clsx(classes.root, className)}
            {...otherProps}
        >
            <MyBoxColumn height={largerThanXl && long ? 0 : 4} width={6}>
                <MyBoxRow width={6}>
                    <MyBox width={6} className={classes.box}>
                        <Typography className={classes.description} variant='body1' dangerouslySetInnerHTML={{ __html: bp.steam.description}} />
                    </MyBox>
                </MyBoxRow>
            </MyBoxColumn>
            <Paper className={classes.corner}>
                <IconButton size='medium' color='inherit' {...linkBpProps(bp.steam.id)}>
                    <Steam fontSize='inherit' />
                </IconButton>
            </Paper>
        </MySection>
    )
})) /* ============================================================================================================= */


type ProjectionCardSteam =
    | 'description'
    | 'id'

interface IBpProjectionRow {
    steam: {[key in keyof Pick<IBlueprint.ISteam, ProjectionCardSteam>]: IBlueprint.ISteam[key]}
}
