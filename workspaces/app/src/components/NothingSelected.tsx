import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Card, CardContent, CardHeader, Container, fade, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import { PROVIDER } from 'src/constants'
import { CONTEXT } from 'src/stores'

import PanelSteam from './PanelSteam'
import PanelUpload from './PanelUpload'
import { Alert, AlertTitle } from '@material-ui/lab'
import AlertUkraine from './AlertUkraine'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        backgroundColor: 'transparent',
        margin: theme.spacing(2),
        maxWidth: 420,
    },

    header: {
        textAlign: 'center',
        backgroundColor: fade(theme.palette.warning.main, 1),
    },
    content: {
        textAlign: 'center',
        margin: theme.spacing(2, 0),
        backgroundColor: fade(theme.palette.background.paper, 0.80),
    },
    label: {
        margin: theme.spacing(1, 0),
        color: theme.palette.text.primary,
        '& > span': {
            color: theme.palette.error.main,
        },
    },
})


interface IProps {
    onSelect?: (idOrName: number | string | null) => void
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const { onSelect } = props
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
        onSelect?.(id ?? null)
    }

    return (
        <Card className={classes.root}>
            <CardHeader className={classes.header} titleTypographyProps={{variant:'h3'}} title='No blueprint selected.' />
            <AlertUkraine />
            {/* <CardContent className={classes.content}>
                <PanelSteam classes={{label: classes.label}} select={select} />
            </CardContent> */}
            <CardContent className={classes.content}>
                <PanelUpload classes={{label: classes.label}} select={select} />
            </CardContent>
        </Card>
    )
})) /* ============================================================================================================= */
