import { IBlueprint } from '@sepraisal/common'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'
import { Link } from 'react-router-dom'

import { AppBar, darken, Toolbar, Typography } from '@material-ui/core'

import { ASYNC_STATE, createSmartFC, createStyles, IMyTheme } from 'src/common'
import { ROUTES } from 'src/constants'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        zIndex: theme.zIndex.appBar - 200,
        padding: theme.spacing(0, 0, 0.5, 0),
        backgroundColor: 'unset',
    },

    toolbar: {
        backgroundColor: theme.palette.success.main,
        minHeight: 56,
    },
    header: {
        '&:hover': {
            textDecoration: 'underline',
        },
        '&:visited': {
            color: darken(theme.palette.success.contrastText, 0.05),
        },
        '&:link': {
            color: theme.palette.success.contrastText,
        },
    },
})


interface IProps {
    state: {code: ASYNC_STATE, text?: string}
    bpId: number|string
    blueprint: IBlueprint | null
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {state, bpId, blueprint} = props
    const getTitle = (): React.ReactNode => {
        switch(state.code) {
            case(ASYNC_STATE.Idle): {
                return '???'
            }
            case(ASYNC_STATE.Doing): {
                return `[${bpId}] Loading ...`
            }
            case(ASYNC_STATE.Error): {
                return `[${bpId}] Error: ${state.text}`
            }
            case(ASYNC_STATE.Done): {
                if(!blueprint) throw new Error('catch me')
                return 'steam' in blueprint && blueprint.steam !== undefined
                    ?
                        (<Link className={classes.header} to={`${ROUTES.ANALYSE}?id=${bpId}`}>
                            {blueprint.steam.title}
                        </Link>)
                    :
                        (<Link className={classes.header} to={`${ROUTES.ANALYSE}?upload=${bpId}`}>
                            {bpId}
                        </Link>)
            }
            default: {
                throw new Error('catch me')
            }
        }
    }
    const title = getTitle()

    const colorMap = {
        [ASYNC_STATE.Idle]: theme.palette.background.default,
        [ASYNC_STATE.Doing]: theme.palette.warning.dark,
        [ASYNC_STATE.Error]: theme.palette.error.dark,
        [ASYNC_STATE.Done]: theme.palette.success.main,
    }

    return (
        <>
            <AppBar position='static' className={classes.root}>
                <Toolbar className={classes.toolbar} style={{backgroundColor: colorMap[state.code]}}>
                    {/* <IconButton color='contrast' aria-label='Menu'>
                        <IconMoreVert />
                    </IconButton> */}
                    <Typography variant='h3' color='inherit' style={{flex: 1}}>
                        {title}
                    </Typography>
                    {children}
                    {/* <IconButton color='inherit' aria-label='remove'>
                        <IconClose />
                    </IconButton> TODO: Add Close for Compare view. */}
                </Toolbar>
            </AppBar>
        </>
    )
})) /* ============================================================================================================= */


type ProjectionCardSteam =
    | 'id'
    | 'title'
    | 'description'
    | 'author'
    | 'collections'
    | 'subscriberCount'
    | 'visitorCount'
    | 'postedDate'
    | 'updatedDate'
    | 'commentCount'
    | 'popularity'

type ProjectionCardSbc =
    | 'gridTitle'

interface IBpProjectionRow {
    _id?: number
    sbc: {[key in keyof Pick<IBlueprint.ISbc, ProjectionCardSbc>]: IBlueprint.ISbc[key]}
    steam?: {[key in keyof Pick<IBlueprint.ISteam, ProjectionCardSteam>]: IBlueprint.ISteam[key]}
}
