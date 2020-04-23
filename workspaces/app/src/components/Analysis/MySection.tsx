import classnames from 'classnames'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'
import { useErrorBoundary } from 'use-error-boundary'

import { Grid, GridProps } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../common'
import { CONTEXT } from '../../stores'
import MyBoxGroup from '../MyBoxGroup'
import MyBox from '../MyBox'
import ValueCell from '../Cell/ValueCell'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        backgroundColor: theme.palette.background.paper,
        borderRadius: `${theme.spacing(1)}px`,
        width: `${268 * 2}px`,
    },

    error: {
        backgroundColor: theme.palette.error.main,
    },

    errorBox: {
        color: theme.palette.error.main,
    },
})


interface IProps extends GridProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {className, ...otherProps} = props
    const { ErrorBoundary, error } = useErrorBoundary()

    let content: React.ReactNode
    if(!error) {
        content = (
            <ErrorBoundary>
                {children}
            </ErrorBoundary>
        )
    } else {
        console.log('hello')
        content = (
            <MyBoxGroup height={2} width={6}>
                <MyBox width={6} classes={{paper: classes.errorBox}}>
                    <ValueCell width={6} label={error.message} value='Something went wrong.' />
                </MyBox>
            </MyBoxGroup>
        )
    }

    return (
        <Grid
            className={classnames(classes.root, className, error && classes.error)}
            component='section'

            item

            container
            spacing={0}
            justify='space-between'
            {...otherProps}
        >
            <CONTEXT.PARENT_COLUMNS.Provider value={12}>
                {content}
            </CONTEXT.PARENT_COLUMNS.Provider>
        </Grid>
    )
})) /* ============================================================================================================= */
