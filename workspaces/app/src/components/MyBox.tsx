import classnames from 'classnames'
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
    h5Root: {
        // backgroundColor: theme.palette.secondary.main,
        borderTopLeftRadius: `${theme.spacing(1)}px`,
    },
    h5Paper: {
        backgroundColor: 'unset',
        boxShadow: theme.shadows[0],
    },
})


interface IProps extends GridProps {
    header?: boolean
    width?: (1 | 2 | 3 | 4 | 5 | 6) | (1.5 | 4.5) | (1.2 | 2.4 | 3.6 | 4.8)
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {className, header, width, ...otherProps} = props
    const widthOrDefault = width ?? 1

    const parentColumns = React.useContext(CONTEXT.PARENT_COLUMNS)
    const columns = Math.round(widthOrDefault * 2 * 12 / parentColumns) as GridSizeColumns

    return (
        <Grid
            className={classnames(classes.root, header && classes.h5Root, className)}

            item
            xs={columns}

            {...otherProps}
        >
            <Grid
                className={classnames(classes.paper, header && classes.h5Paper)}
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
