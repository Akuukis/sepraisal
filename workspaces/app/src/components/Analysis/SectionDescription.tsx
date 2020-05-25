import { IBlueprint } from '@sepraisal/common'
import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { darken, IconButton, Paper, Typography, useMediaQuery } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme, linkBpProps, STEAM_COLORS } from 'src/common'

import IconSteam from '../icons/IconSteam'
import MyBox from '../MyBox'
import MyBoxColumn from '../MyBoxColumn'
import MyBoxRow from '../MyBoxRow'
import MySection from './MySection'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },
    box: {
        padding: 0,
        overflowY: 'scroll',
    },
    boxXl: {
        overflowY: 'unset',
    },
    paper: {
        display: 'block',
        height: 'unset',
    },

    corner: {
        float: 'right',
        backgroundColor: theme.palette.background.default,
        color: 'black',
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
        '& > a:link': {
            color: theme.palette.primary.light,
        },
        '& > a:visited': {
            color: darken(theme.palette.primary.light, 0.5),
        },
        minHeight: `calc(100% - ${theme.spacing(2) * 2}px)`,
        [theme.breakpoints.up('xl')]: {
            minHeight: `15em`,
        },
        width: `calc(100% - ${theme.spacing(2) * 2}px)`,
        overflow: 'unset',  // Required for floating corner.
    },
})


interface IProps extends Omit<React.ComponentProps<typeof MySection>, 'heading' | 'value' | 'label'> {
    bp: IBpProjectionRow
    long?: boolean
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {bp, className, long, ...otherProps} = props
    const xlUp = useMediaQuery(theme.breakpoints.up('xl'), { noSsr: true })

    return (
        <MySection
            heading='Description'
            label=''
            value=''
            MyBoxColumnProps={{style: {display: 'none'}}}
            className={clsx(classes.root, className)}
            {...otherProps}
        >
            <MyBoxColumn height={xlUp && long ? 0 : 7} width={6}>
                <MyBoxRow width={6}>
                    <MyBox
                        width={6}
                        classes={{
                            root: clsx(classes.box, xlUp && long && classes.boxXl),
                            paper: classes.paper,
                        }}
                    >
                        <Paper square className={classes.corner}>
                            <IconButton size='medium' color='inherit' {...linkBpProps(bp.steam.id)}>
                                <IconSteam fontSize='inherit' />
                            </IconButton>
                        </Paper>
                        <Typography
                            className={classes.description}
                            variant='body1'
                            dangerouslySetInnerHTML={{ __html: bp.steam.description}}
                        />
                    </MyBox>
                </MyBoxRow>
            </MyBoxColumn>
        </MySection>
    )
})) /* ============================================================================================================= */


type ProjectionCardSteam =
    | 'description'
    | 'id'

interface IBpProjectionRow {
    steam: {[key in keyof Pick<IBlueprint.ISteam, ProjectionCardSteam>]: IBlueprint.ISteam[key]}
}
