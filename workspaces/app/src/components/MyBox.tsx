import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid, GridProps } from '@material-ui/core'

import { createSmartFC, createStyles, GridSizeColumns, IMyTheme } from '../common'
import { CONTEXT } from '../stores'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        minHeight: theme.shape.boxHeight,
        maxHeight: '100%',
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
    headerRoot: {
    },
    headerPaper: {
        backgroundColor: theme.palette.success.main,
        boxShadow: theme.shadows[0],
    },
})


interface IProps extends GridProps {
    variant?: 'box' | 'flat' | 'header'
    width?: (1 | 2 | 3 | 4 | 5 | 6) | (1.5 | 4.5) | (1.2 | 2.4 | 3.6 | 4.8)
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {className, variant, width, ...otherProps} = props
    const widthOrDefault = width ?? (variant === 'header' ? 2 : 1)

    const parentColumns = React.useContext(CONTEXT.PARENT_COLUMNS)
    const columns = Math.round(widthOrDefault * 2 * 12 / parentColumns) as GridSizeColumns

    const rootClassName = clsx(classes.root, {
            [classes.flatRoot]: variant === 'flat',
            [classes.headerRoot]: variant === 'header',
        }, className)
    const paperClassName = clsx(classes.paper, {
            [classes.flatPaper]: variant === 'flat',
            [classes.headerPaper]: variant === 'header',
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
                <CONTEXT.PARENT_COLUMNS.Provider value={parentColumns/12 * columns as GridSizeColumns}>
                    {children}
                </CONTEXT.PARENT_COLUMNS.Provider>
            </Grid>
        </Grid>
    )
})) /* ============================================================================================================= */
