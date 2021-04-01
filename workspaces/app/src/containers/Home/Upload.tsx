import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Typography } from '@material-ui/core'
import { CSSProperties } from '@material-ui/styles'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import IconBrowse from 'src/components/icons/IconBrowse'
import Upload from 'src/components/Upload'
import { CONTEXT } from 'src/stores'

import HomeCard from './HomeCard'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    button: {
        marginTop: theme.spacing(4),
        marginBottom: theme.spacing(8),
    },
    code: {
        ...theme.typography.mono,
        fontSize: theme.typography.caption.fontSize,
        backgroundColor: theme.palette.background.default,
    } as CSSProperties,
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const routerStore = React.useContext(CONTEXT.ROUTER)

    const handleUpload = (title: string) => {
        routerStore.goUpload(title)
    }

    const handleError = (error: Error) => {
        alert(error)
    }

    return (
        <HomeCard
            className={classes.root}
            Icon={IconBrowse}
            heading='Local Analysis'
        >
            <Typography align='center' variant='h3'>
                    Drag'n'drop your blueprint for analysis.
            </Typography>
            <Typography paragraph>
                The blueprint is analysed locally in your browser.
                It <strong>is not</strong> sent anywhere, for publishing use Steam Workshop instead.
            </Typography>
            <Typography paragraph variant="caption">
                Blueprints can be found at <Typography component="code" className={classes.code}>C:\Users\YourUserName\Appdata\Roaming\SpaceEngineers\Blueprints</Typography>.
                If you don't see <Typography component="code" className={classes.code}>Appdata</Typography> folder, then you need to show hidden folders in settings.
            </Typography>
            <Upload onUpload={handleUpload} onError={handleError} />
        </HomeCard>
    )
})) /* ============================================================================================================= */
