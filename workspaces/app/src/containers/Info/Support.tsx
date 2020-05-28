import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import MyLink from 'src/components/MyLink'
import { SERVICE_DESK_EMAIL } from 'src/constants'

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
                Please send an email to <MyLink href={`mailto:${SERVICE_DESK_EMAIL}`}>{SERVICE_DESK_EMAIL}</MyLink> describing it.
                It helps a lot if you are explicit and add screenshots.
                Your email will create an issue ticket <MyLink href='https://gitlab.com/akuukis/sepraisal/issues'>here</MyLink> that you can follow and respond to.
            </Typography>
            <Typography paragraph>
                Thank you!
            </Typography>
        </InfoCard>
    )
})) /* ============================================================================================================= */
