import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Button, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import IconBrowse from 'src/components/icons/IconBrowse'
import { ROUTE } from 'src/constants'
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
        <HomeCard className={classes.root} Icon={IconBrowse} heading='Browse'>
            <Typography align='center' variant='h3'>
                Browse all Steam workshop blueprints.
            </Typography>
            <Typography component='div' paragraph>
                <ul>
                    <li><strong>Filters</strong>: vanilla-ness, blocks, PCU, required ores, etc.</li>
                    <li><strong>Text search</strong>: narrow down by title, author, etc.</li>
                    <li><strong>Sort</strong>: by subscribers, blocks, PCU, and required ore.</li>
                </ul>
            </Typography>
            <Button
                className={classes.button}
                color='primary'
                variant='contained'
                onClick={() => routerStore.goView(ROUTE.BROWSE)}
                fullWidth
            >
                <Typography variant='button'>{'Browse Fighters'}</Typography>
            </Button>
        </HomeCard>
    )
})) /* ============================================================================================================= */
