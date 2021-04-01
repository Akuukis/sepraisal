import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Divider } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import { PROVIDER } from 'src/constants'
import { CONTEXT } from 'src/stores'

import PanelRandom from './PanelRandom'
import PanelSteam from './PanelSteam'
import PanelUpload from './PanelUpload'

const styles = (theme: IMyTheme) => createStyles({
    root: {
        paddingBottom: theme.spacing(4),
    },

    label: {
        margin: theme.spacing(2, 0),
        color: theme.palette.text.primary,
        '& > span': {
            color: theme.palette.error.main,
        },
    },
    divider: {
        backgroundColor: theme.palette.primary.light,
        display: 'inherit !important',
        height: 2,
        margin: theme.spacing(2, 0),
    },
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const routerStore = React.useContext(CONTEXT.ROUTER)

    const select = async (id?: number | string) => {
        if(id === undefined) {
            routerStore.replace({...location, search: undefined})
        } else if (typeof id === 'number') {
            routerStore.replace({...location, search: `?${PROVIDER.STEAM}=${id}`})
        } else if(typeof id === 'string') {
            routerStore.replace({...location, search: `?${PROVIDER.LOCAL}=${id}`})
        } else {
            throw new Error('catch me')
        }
    }

    return (
        <div
            className={classes.root}
        >
            <PanelSteam classes={{label: classes.label}} select={select} />
            <Divider className={classes.divider} />
            {process.env.NODE_ENV === 'development' && (<>
                <PanelRandom classes={{label: classes.label}} select={select} />
                <Divider className={classes.divider} />
            </>)}
            <PanelUpload classes={{label: classes.label}} select={select} />
        </div>
    )
})) /* ============================================================================================================= */
