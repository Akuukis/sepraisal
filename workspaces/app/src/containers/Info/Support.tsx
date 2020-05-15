import { SERVICE_DESK_EMAIL } from '@sepraisal/common'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'

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
            <Typography paragraph>
                Found a bug? Something is not working or is confusing?
            </Typography>
            <Typography paragraph>
                Please send a email to <a href={`mailto:${SERVICE_DESK_EMAIL}`}>{SERVICE_DESK_EMAIL}</a> describing it.
                Please attach screenshots, that helps a lot.
                Your email will create a issue ticket <a href='//gitlab.com/akuukis/sepraisal/issues'>here</a> to easily track and respond to it.
                Thank you!
            </Typography>
        </InfoCard>
    )
})) /* ============================================================================================================= */
