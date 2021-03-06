import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Button, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import IconBrowse from 'src/components/icons/IconBrowse'
import { BROWSE_PARTS, ROUTE } from 'src/constants'
import { CONTEXT } from 'src/stores'
import { PRESET } from 'src/stores/CardStore'

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
        const searchParams = new URLSearchParams(location.search)
        searchParams.set(BROWSE_PARTS.FILTER, JSON.stringify(PRESET.fighter))
        routerStore.goView(`${ROUTE.BROWSE}?${searchParams.toString()}`)
    }

    return (
        <HomeCard
            className={classes.root}
            Icon={IconBrowse}
            heading='Online Analysis'
            button={(
                <Button color='primary' variant='contained' onClick={onClick} fullWidth>
                    Browse
                </Button>
            )}
        >
            <Typography align='center' variant='h3'>
                Analyse any blueprint on Steam workshop.
            </Typography>
            <Typography component='div' paragraph>
                Enter Steam workshop link or ID to open it's analysis.
            </Typography>
            <Typography component='div' paragraph>
                Search by author, collection, or free text. Filters by grid size, blocks, PCU, required ores, etc.
            </Typography>
        </HomeCard>
    )
})) /* ============================================================================================================= */
