import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Link, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme, linkProps } from 'src/common'
import IconDiscord from 'src/components/icons/IconDiscord'
import IconGithub from 'src/components/icons/IconGithub'
import IconGitlab from 'src/components/icons/IconGitlab'

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
            <Typography variant='h5'>Maintainers</Typography>
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
                        <strong>Akuukis#6154</strong> (<Link {...linkProps('//discord.gg/98VJRWf')}>on KeenSW Server</Link>)
                    </li>
                    <li>
                        <IconGitlab fontSize='default' className={classes.icon} />
                        &nbsp;
                        <Link {...linkProps('//gitlab.com/Akuukis')}><strong>Akuukis</strong></Link>
                    </li>
                    <li>
                        <IconGithub fontSize='default' className={classes.icon} />
                        &nbsp;
                        <Link {...linkProps('//github.com/Akuukis')}><strong>Akuukis</strong></Link>
                    </li>
                </ul>
            </Typography>
            <Typography variant='h5'>Keen Software House</Typography>
            <Typography paragraph>
                <a href='https://www.keenswh.com/'>You</a> are great! Thanks for making <a href='https://www.spaceengineersgame.com/'>Space Engineers</a> :)
            </Typography>
            <Typography variant='h5'>Legal</Typography>
            <Typography paragraph>
                This website is open-source (<a href='//choosealicense.com/licenses/gpl-3.0/'>GPLv3</a>).
                You can find source code at <a href='//gitlab.com/akuukis/sepraisal'>Gitlab</a>.
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
