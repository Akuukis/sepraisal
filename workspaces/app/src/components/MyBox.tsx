import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid, GridProps } from '@material-ui/core'

import { createSmartFC, createStyles, GridSizeColumns, IMyTheme } from 'src/common'

import { CONTEXT } from '../stores'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        minHeight: theme.shape.boxHeight,
        maxHeight: '100%',
        padding: theme.spacing(0.5),
    },

    paper: {
        backgroundColor: theme.palette.background.paper,
        height: '100%',
        color: theme.palette.text.primary,
        boxShadow: theme.shadows[theme.spacing(1)/2],
        transition: theme.transitions.create('box-shadow'),
        borderRadius: theme.shape.borderRadius,
        overflow: 'hidden',
    },
    flatRoot: {
    },
    flatPaper: {
        backgroundColor: 'unset',
        boxShadow: theme.shadows[0],
    },
})


interface IProps extends GridProps {
    variant?: 'box' | 'flat'
    width?: (1 | 2 | 3 | 4 | 5 | 6) | (1.5 | 4.5) | (1.2 | 2.4 | 3.6 | 4.8)
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {className, variant, width, ...otherProps} = props

    const {parentColumns, maxWidth} = React.useContext(CONTEXT.PARENT_COLUMNS)
    const widthOrDefault = width ?? 1

    const tmpColumns = widthOrDefault * (12/maxWidth) * (12/parentColumns) as GridSizeColumns
    const columns = Math.min(12, tmpColumns) as GridSizeColumns

    const rootClassName = clsx(classes.root, {
            [classes.flatRoot]: variant === 'flat',
        }, className)
    const paperClassName = clsx(classes.paper, {
            [classes.flatPaper]: variant === 'flat',
        }, className)

    return (
        <Grid
            className={rootClassName}

            item
            xs={columns}

            {...otherProps}
        >
            <Grid
                className={paperClassName}
                container
                spacing={0}
                justify='space-between'
                alignItems='stretch'
            >
            <CONTEXT.PARENT_COLUMNS.Provider value={{parentColumns: parentColumns/12 * columns as GridSizeColumns, maxWidth}}>
                    {children}
                </CONTEXT.PARENT_COLUMNS.Provider>
            </Grid>
        </Grid>
    )
})) /* ============================================================================================================= */
