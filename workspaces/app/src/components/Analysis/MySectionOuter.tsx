import * as React from 'react'
import { hot } from 'react-hot-loader/root'
import { useErrorBoundary } from 'use-error-boundary'

import { GridProps } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../common'
import ValueCell from '../Cell/ValueCell'
import MyBox from '../MyBox'
import MyBoxColumn from '../MyBoxColumn'
import MySectionInner from './MySectionInner'


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

    console.log(heading)

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
            <MyBoxColumn height={2} width={6}>
                <MyBox width={6} classes={{paper: classes.errorBox}}>
                    <ValueCell width={6} label={error.message} value='Something went wrong.' />
                </MyBox>
            </MyBoxColumn>
        )
    }

    return (
        <MySectionInner
            className={error && classes.error}
            {...otherProps}
        >
            {content}
        </MySectionInner>
    )
})) /* ============================================================================================================= */
