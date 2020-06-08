import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import IconDiscord from 'src/components/icons/IconDiscord'
import IconGithub from 'src/components/icons/IconGithub'
import IconGitlab from 'src/components/icons/IconGitlab'
import MyLink from 'src/components/MyLink'
import { ROUTE } from 'src/constants'

import InfoCard from './InfoCard'

const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    icon: {
        verticalAlign: 'text-bottom',
    },
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {

    return (
        <InfoCard className={classes.root} heading='Credits'>
            <Typography variant='h3'>Maintainers</Typography>
            <Typography paragraph>
                SE Praisal was created and is maintained by Akuukis.
            </Typography>
            <Typography paragraph>
                A team of one is rather a lonely endeavour. If you are interested to join or help out occasionally, contact Akuukis here:
            </Typography>
            <Typography paragraph component='div'>
                <ul>
                    <li>
                        <IconDiscord fontSize='default' className={classes.icon} />
                        &nbsp;
                        <strong>Akuukis#6154</strong> (<MyLink href='https://discord.gg/98VJRWf'>on KeenSW Server</MyLink>)
                    </li>
                    <li>
                        <IconGitlab fontSize='default' className={classes.icon} />
                        &nbsp;
                        <MyLink href='https://gitlab.com/Akuukis'><strong>Akuukis</strong></MyLink>
                    </li>
                    <li>
                        <IconGithub fontSize='default' className={classes.icon} />
                        &nbsp;
                        <MyLink href='https://github.com/Akuukis'><strong>Akuukis</strong></MyLink>
                    </li>
                </ul>
            </Typography>
            <Typography variant='h3'>Keen Software House</Typography>
            <Typography paragraph>
                <MyLink href='https://www.keenswh.com/'>You</MyLink> are great! Thanks for making <MyLink href='https://www.spaceengineersgame.com/'>Space Engineers</MyLink> :)
            </Typography>
            <Typography variant='h3'>Image of front page</Typography>
            <Typography paragraph>
                Credits goes to <MyLink href='https://steamcommunity.com/id/IratusAvis'>IratusAvis</MyLink> who made the gorgeous image seen on the front page.
                The ship in the image is <MyLink href={`${ROUTE.ANALYSE}?steam=1532840584`}>Red Destroyer</MyLink>,
                that got 2nd place in <MyLink href='https://blog.marekrosa.org/2018/06/the-results-of-space-engineers-nvidia.html'>Space Engineers NVIDIA Ansel Contest</MyLink>.
            </Typography>
            <Typography variant='h3'>License</Typography>
            <Typography paragraph>
                The website, backend, and praisal library are all open-source (<MyLink href='//choosealicense.com/licenses/gpl-3.0/'>GPLv3</MyLink>).
                You can find source code at <MyLink href='//gitlab.com/akuukis/sepraisal'>Gitlab</MyLink>.
            </Typography>
            <Typography paragraph>
                The name ('Space Engineers Praisal') and associated domain belongs to Akuukis.
            </Typography>
            <Typography paragraph>
                Game assets are used with Keen Software House permission in personal communication with Akuukis.
            </Typography>
            <Typography variant='h3'>Privacy</Typography>
            <Typography paragraph>
                To get critical information about the behavior of our visitors, we use <MyLink href='https://simpleanalytics.com'>Simple Analytics</MyLink>.
                This analytics software gives us insight about our visitors only in general, but not about individuals per say, as it does not track visitors
                and does not store any personal identifiable information. <MyLink href='https://docs.simpleanalytics.com/what-we-collect'>Go to their documentation</MyLink> to
                find out what Simple Analytics collects (and most importantly what they don't).
            </Typography>
            <Grid container>
                <Grid item xs={6}>
                    <Typography>
                        Try out Simple Analytics with 1 month free trial by using this <MyLink href='referral.simpleanalytics.com/akuukis'>referral link</MyLink>.
                    </Typography>
                </Grid>
                <Grid item xs={6}>
                    <MyLink
                        href='https://simpleanalytics.com/spaceengineerspraisal.net?utm_source=spaceengineerspraisal.net&utm_content=badge'
                        referrerPolicy='origin'
                        rel='noopener'  // Override noreferrer.
                    >
                        <img
                            src='https://simpleanalyticsbadge.com/spaceengineerspraisal.net'
                            loading='lazy'
                            referrerPolicy='no-referrer'
                            crossOrigin='anonymous'
                        />
                    </MyLink>
                </Grid>
            </Grid>
        </InfoCard>
    )
})) /* ============================================================================================================= */
