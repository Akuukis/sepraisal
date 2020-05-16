import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid, GridProps } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'

import Search from './Search'
import Sort from './Sort'
import Status from './Status'

const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    search: {
    },
    searchDisabledSort: {
        borderBottomRightRadius: theme.shape.borderRadius,
        borderTopRightRadius: theme.shape.borderRadius,
    },
    wrapper: {
        flexGrow: 1,
        flexWrap: 'nowrap',
        maxWidth: 640,
        [theme.breakpoints.down('xs')]: {
            flexBasis: '100%',
        }
    }
})


interface IProps extends GridProps {
    disableStatus?: true
    disableSort?: true
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {disableStatus, disableSort, className, ...otherProps} = props

    return (
        <Grid
            className={clsx(classes.root, className)}
            item
            xs={12}

            container
            justify='center'
            alignItems='center'
            {...otherProps}
        >
            <Grid item xs container justify='center' alignItems='stretch' className={classes.wrapper}>
                <Search className={clsx(classes.search, disableSort && classes.searchDisabledSort)} />
                {!disableSort && <Sort />}
            </Grid>
            {!disableStatus && <Status />}
        </Grid>
    )
})) /* ============================================================================================================= */
