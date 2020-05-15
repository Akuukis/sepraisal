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
        <InfoCard className={classes.root} heading='Credits'>
            <Typography variant='h5'>Maintainers</Typography>
            <Typography paragraph component='div'>
                <ul>
                    <li>
                        <strong>Akuukis</strong> -
                        contact on: <a href='//github.com/Akuukis'>Github</a>, <a href='//gitlab.com/Akuukis'>GitLab</a>, or Discord: Akuukis#6154.
                    </li>
                    <li><em>... looking for maintainers (if interested, DM Akuukis) ...</em></li>
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
                Game assets are used with Keen Software House permission in personal communication with Akuukis.
            </Typography>
        </InfoCard>
    )
})) /* ============================================================================================================= */
