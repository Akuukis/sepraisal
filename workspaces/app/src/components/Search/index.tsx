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
    searchenabledSort: {
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
    },
})


interface IProps extends GridProps {
    enableStatus?: boolean
    enableSort?: boolean
    enableButton?: boolean
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {enableStatus, enableSort, enableButton, className, ...otherProps} = props

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
                <Search enableButton={enableButton} className={clsx(classes.search, enableSort && classes.searchenabledSort)} />
                {enableSort && <Sort />}
            </Grid>
            {enableStatus && <Status />}
        </Grid>
    )
})) /* ============================================================================================================= */
