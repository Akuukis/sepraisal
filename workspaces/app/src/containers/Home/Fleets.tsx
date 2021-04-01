import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Button, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import IconAnalyse from 'src/components/icons/IconAnalyse'
import { ROUTE } from 'src/constants'
import { CONTEXT } from 'src/stores'

import HomeCard from './HomeCard'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const routerStore = React.useContext(CONTEXT.ROUTER)

    const onClick = () => {
        routerStore.goView(`${ROUTE.BLOG}/fleets`)
    }


    return (
        <HomeCard
            className={classes.root}
            Icon={IconAnalyse}
            heading='Fleet Rankings'
            button={(
                <Button color='primary' variant='contained' onClick={onClick} fullWidth>
                    Fleets Rankings
                </Button>
            )}
        >
            <Typography align='center' variant='h3'>
                Find TOP Space Engineers fleets.
            </Typography>
            <Typography component='div' paragraph>
                See all 291 Space Engineers fleets in one big table, ranked by average subscribers.
                It's last updated on Apr 01, 2021.
            </Typography>
        </HomeCard>
    )
})) /* ============================================================================================================= */
