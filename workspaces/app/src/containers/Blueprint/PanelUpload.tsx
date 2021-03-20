import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { FormControl, FormLabel } from '@material-ui/core'

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
        marginTop: theme.spacing(2),
    },
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
                <FormLabel className={classes.label}>Upload your blueprint:</FormLabel>
                <Upload onUpload={onUpload} onError={onError} classes={{root: classes.upload}} />
            </FormControl>
        </form>
    );
})) /* ============================================================================================================= */
