import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Button, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../common/'
import { ROUTES } from '../../constants/routes'
import { CONTEXT } from '../../stores'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        backgroundColor: theme.palette.background.default,
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
        minWidth: 56,
    },
    title: {
        '@media (max-width: 600px)': {
                display: 'none',
        },
    },
})


interface IProps {
        icon: JSX.Element
        route: ROUTES
        title: string
}


export default hot(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {
    const routerStore = React.useContext(CONTEXT.ROUTER)

    const h = (event: React.MouseEvent) => {
        // tslint:disable-next-line: no-non-null-assertion
        const path = event.currentTarget.getAttribute('value')!
        routerStore.push(path)
    }

    return (
        <Button
            variant='contained'
            className={classes.root}
            onClick={h}
            value={props.route}
        >
            {props.icon}
            <Typography
                className={classes.title}
                variant='button'
            >
                {props.title}
            </Typography>
        </Button>
    )
})) /* ============================================================================================================= */
