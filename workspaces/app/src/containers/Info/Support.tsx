import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import MyLink from 'src/components/MyLink'

import InfoCard from './InfoCard'

const styles = (theme: IMyTheme) => createStyles({
    root: {
    },
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {

    return (
        <InfoCard className={classes.root} heading='Support'>
            <Typography paragraph variant='h3'>
                Found a bug? Something is confusing?
            </Typography>
            <Typography paragraph>
                Please create an issue ticket <MyLink href='https://github.com/akuukis/sepraisal/issues'>here</MyLink>.
                Or you can text details to Akuukis over Discord.
            </Typography>
            <Typography paragraph>
                Thank you!
            </Typography>
        </InfoCard>
    )
})) /* ============================================================================================================= */
