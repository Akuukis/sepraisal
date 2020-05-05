import * as React from 'react'
import { hot } from 'react-hot-loader/root'
import { useErrorBoundary } from 'use-error-boundary'

import { GridProps } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../common'
import MySection from './MySection'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    error: {
        backgroundColor: theme.palette.error.main,
    },

    errorBox: {
        color: theme.palette.error.main,
    },
})


interface IProps extends GridProps {
    heading: string
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {heading, className, ...otherProps} = props
    const { ErrorBoundary, error } = useErrorBoundary()

    if(error) {
        return (
            <MySection
                className={error && classes.error}
                classes={{MyBox: classes.errorBox}}
                heading={heading}
                {...otherProps}
                label={error.message}
                value='Something went wrong.'
            />
        )
    }

    return (
        <ErrorBoundary>
            {children}
        </ErrorBoundary>
    )

})) /* ============================================================================================================= */
