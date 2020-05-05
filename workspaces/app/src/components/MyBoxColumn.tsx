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
    const {parentColumns, maxWidth} = React.useContext(CONTEXT.PARENT_COLUMNS)

    const heightOrDefault = height ?? 1
    const widthOrDefault = width ?? maxWidth

    const tmpColumns = widthOrDefault * (12/maxWidth) * (12/parentColumns) as GridSizeColumns
    const columns = Math.min(12, tmpColumns) as GridSizeColumns
    const heightFinal = heightOrDefault * (tmpColumns/columns)

    return (
        <Grid
            className={classnames(classes.root, className)}
            style={{height: (heightFinal * theme.shape.boxHeight) || undefined}}

            item
            xs={columns}

            container
            spacing={0}
            direction='column'
            justify='space-between'
            {...otherProps}
        >
            <CONTEXT.PARENT_COLUMNS.Provider value={{parentColumns: parentColumns/12 * columns as GridSizeColumns, maxWidth}}>
                {children}
            </CONTEXT.PARENT_COLUMNS.Provider>
        </Grid>
    )
})) /* ============================================================================================================= */
