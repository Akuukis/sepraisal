import classnames from 'classnames'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid, GridProps, useMediaQuery } from '@material-ui/core'

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
    const largerThanSm = useMediaQuery(theme.breakpoints.up('sm'))

    const heightOrDefault = height ?? 1
    const widthOrDefault = width ?? 6

    const widthFinal = largerThanSm ? widthOrDefault : Math.min(3, widthOrDefault)
    const heightFinal = heightOrDefault * (largerThanSm || widthOrDefault === widthFinal ? 1 : 2)

    const columns = Math.round(widthOrDefault * 2 * 12 / parentColumns) as GridSizeColumns

    return (
        <Grid
            className={classnames(classes.root, className)}
            style={{height: heightFinal * theme.shape.boxHeight}}

            item
            xs={columns}

            container
            spacing={0}
            direction='column'
            justify='space-between'
            {...otherProps}
        >
            <CONTEXT.PARENT_COLUMNS.Provider value={parentColumns/12 * columns as GridSizeColumns}>
                {children}
            </CONTEXT.PARENT_COLUMNS.Provider>
        </Grid>
    )
})) /* ============================================================================================================= */
