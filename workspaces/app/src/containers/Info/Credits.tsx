import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import IconDiscord from 'src/components/icons/IconDiscord'
import IconGithub from 'src/components/icons/IconGithub'
import IconGitlab from 'src/components/icons/IconGitlab'
import MyLink from 'src/components/MyLink'

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
            <Typography variant='h3'>Legal</Typography>
            <Typography paragraph>
                This website is open-source (<MyLink href='//choosealicense.com/licenses/gpl-3.0/'>GPLv3</MyLink>).
                You can find source code at <MyLink href='//gitlab.com/akuukis/sepraisal'>Gitlab</MyLink>.
            </Typography>
            <Typography paragraph>
                The name ("Space Engineers Praisal") and associated domain belongs to Akuukis.
            </Typography>
            <Typography paragraph>
                Game assets are used with Keen Software House permission in personal communication with Akuukis.
            </Typography>
        </InfoCard>
    )
})) /* ============================================================================================================= */
