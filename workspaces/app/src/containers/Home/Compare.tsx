import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Button, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import IconCompare from 'src/components/icons/IconCompare'
import { ROUTES } from 'src/constants/routes'
import { CONTEXT } from 'src/stores'

import HomeCard from './HomeCard'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    button: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(8),
    }
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const routerStore = React.useContext(CONTEXT.ROUTER)

    return (
        <HomeCard className={classes.root} heading='3. Compare'>
            <Typography align='center' variant='subtitle1'>
                Compare blueprints side-to-side.
            </Typography>
            <Typography component='div' paragraph>
                <ul>
                    <li><strong>Offline blueprints</strong>: Upload your own blueprint.</li>
                    <li><strong>Recent</strong>: Easy access to recently viewed blueprints.</li>
                    <li><strong>Unlimited</strong>: Compare as many blueprints as you can.</li>
                </ul>
            </Typography>
            <Button
                className={classes.button}
                color='primary'
                variant='outlined'
                onClick={() => routerStore.goView(ROUTES.COMPARE)}
                fullWidth
            >
                <IconCompare />
                <Typography variant='button'>{'Compare'}</Typography>
            </Button>
        </HomeCard>
    )
})) /* ============================================================================================================= */
