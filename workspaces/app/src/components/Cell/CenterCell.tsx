import classnames from 'classnames'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid, GridProps } from '@material-ui/core'

import { createSmartFC, createStyles, GridSizeColumns, IMyTheme } from '../../common/'
import { CONTEXT } from '../../stores'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        overflowY: 'auto',
        overflowX: 'hidden',
        maxHeight: '100%',
    },

    padded: {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(1),
    }
})


export interface IProps extends GridProps {
    padded?: boolean
    width?: (1 | 2 | 3 | 4 | 5 | 6) | (1.5 | 4.5) | (1.2 | 2.4 | 3.6 | 4.8)
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {className, padded, width, ...otherProps} = props
    const widthOrDefault = width ?? 1

    const {parentColumns, maxWidth} = React.useContext(CONTEXT.PARENT_COLUMNS)
    const columns = widthOrDefault * (12/maxWidth) * (12/parentColumns) as GridSizeColumns

    return (
        <Grid
            className={classnames(classes.root, padded && classes.padded, className)}

            item
            xs={columns}

            container
            justify='center'
            alignItems='center'

            {...otherProps}
        >
            {children}
        </Grid>
    )
})) /* ============================================================================================================= */
