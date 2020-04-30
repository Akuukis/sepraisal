import classnames from 'classnames'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid, GridProps } from '@material-ui/core'

import { createSmartFC, createStyles, GridSizeColumns, IMyTheme } from '../common'
import { CONTEXT } from '../stores'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        overflow: 'hidden',
    },
})


interface IProps extends GridProps {
    height?: number
    width?: (1 | 2 | 3 | 4 | 5 | 6) | (1.5 | 4.5) | (1.2 | 2.4 | 3.6 | 4.8)
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {className, height, width, ...otherProps} = props
    const parentColumns = React.useContext(CONTEXT.PARENT_COLUMNS)

    const heightOrDefault = height ?? 1
    const widthOrDefault = width ?? parentColumns/2

    const columns = Math.round(widthOrDefault * 2 * 12 / parentColumns) as GridSizeColumns

    return (
        <Grid
            className={classnames(classes.root, className)}
            style={{flex: heightOrDefault}}

            item

            container
            spacing={0}
            justify='space-between'
            alignItems='stretch'
            {...otherProps}
        >
            <CONTEXT.PARENT_COLUMNS.Provider value={parentColumns/12 * columns as GridSizeColumns}>
                {children}
            </CONTEXT.PARENT_COLUMNS.Provider>
        </Grid>
    )
})) /* ============================================================================================================= */
