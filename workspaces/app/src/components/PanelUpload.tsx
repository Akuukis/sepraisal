import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { FormControl, FormLabel, Typography } from '@material-ui/core'
import { CSSProperties } from '@material-ui/styles'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import Upload from 'src/components/Upload'
import { CONTEXT } from 'src/stores'

const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    button: {
        margin: theme.spacing(1),
        minWidth: 240,
        maxWidth: 240,
    },
    helperText: {
    },
    label: {
    },
    upload: {
        margin: theme.spacing(2, 0),
    },
    code: {
        ...theme.typography.mono,
        fontSize: theme.typography.caption.fontSize,
        backgroundColor: theme.palette.background.default,
    } as CSSProperties,
})


interface IProps extends React.ComponentProps<'form'> {
    select: (id: string | number) => void
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {select, className, ...otherProps} = props
    const analyticsStore = React.useContext(CONTEXT.ANALYTICS)

    const onUpload = (title: string) => {
        analyticsStore.trackEvent(
            'blueprint',
            'uploadSuccessful',
            title,
            undefined,
        )
        select(title)
    }
    const onError = (error: Error) => {
        console.error(error)
    }

    return (
        <form className={clsx(classes.root, className)} {...otherProps}>
            <FormControl>
                <FormLabel className={classes.label}>Analyse a blueprint from your PC:</FormLabel>
                <Upload onUpload={onUpload} onError={onError} classes={{root: classes.upload}} />
                <Typography paragraph variant="caption">
                    The blueprint is analysed locally in your browser.
                    It <strong>is not</strong> sent anywhere, for publishing use Steam Workshop instead.
                </Typography>
                <Typography paragraph variant="caption">
                    Blueprints can be found at <Typography component="code" className={classes.code}>C:\Users\YourUserName\Appdata\Roaming\SpaceEngineers\Blueprints</Typography>.
                    If you don't see <Typography component="code" className={classes.code}>Appdata</Typography> folder, then you need to show hidden folders in settings.
                </Typography>
            </FormControl>
        </form>
    );
})) /* ============================================================================================================= */
