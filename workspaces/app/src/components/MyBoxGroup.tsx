import classnames from 'classnames'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid, GridProps } from '@material-ui/core'

import { createSmartFC, createStyles, GridSizeColumns, IMyTheme } from '../common'
import { CONTEXT } from '../stores'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        margin: 0,
    },
})


interface IProps extends GridProps {
    height?: number
    width?: (1 | 2 | 3 | 4 | 5 | 6) | (1.5 | 4.5) | (1.2 | 2.4 | 3.6 | 4.8)
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {className, height, width, ...otherProps} = props
    const heightOrDefault = height ?? 1
    const widthOrDefault = width ?? 6

    const columns = widthOrDefault * 2 as GridSizeColumns

    return (
        <Grid
            className={classnames(classes.root, className)}
            style={{height: heightOrDefault * theme.shape.boxHeight}}

            item
            xs={columns}

            container
            spacing={1}
            justify='space-between'
            alignItems='stretch'
            {...otherProps}
        >
            <CONTEXT.PARENT_COLUMNS.Provider value={columns}>
                {children}
            </CONTEXT.PARENT_COLUMNS.Provider>
        </Grid>
    )
})) /* ============================================================================================================= */
