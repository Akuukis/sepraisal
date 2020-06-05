import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Tooltip } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },
})


interface IProps {
    children: React.ReactElement
    open: boolean
    value: React.ReactNode
}

export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const { open, value } = props

    return (
        <Tooltip
            className={classes.root}
            open={open}
            enterTouchDelay={0}
            placement='top'
            arrow
            title={value}
        >
            {children}
        </Tooltip>
    );
})) /* ============================================================================================================= */
