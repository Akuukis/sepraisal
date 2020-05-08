import classnames from 'classnames'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { fade, Grid, GridProps } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        padding: theme.spacing(1),
        width: '100%',
        height: '100%',
        flex: 1,
        color: '#0000',
        borderColor: `#0000`,
    },

    container: {
        color: 'inherit',
        borderColor: `inherit`,
        width: '100%',
        height: '100%',
        borderStyle: `dashed`,
        borderWidth: theme.spacing(0.5),
        flexWrap: 'nowrap',
    },
    rootOnHover: {
        cursor: 'pointer',
        color: theme.palette.text.secondary,
        backgroundColor: fade(theme.palette.background.default, 0.9),
        '&:hover': {
            backgroundColor: fade(theme.palette.background.paper, 0.9),
        },
    },
})


interface IProps extends GridProps {
    // onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
    isHover: boolean
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {isHover, ...otherProps} = props

    return (
        <Grid
            item
            className={classnames({[classes.root]: true, [classes.rootOnHover]: isHover})}
        >
            <Grid
                container
                alignItems='center'
                justify='center'
                className={classes.container}
                {...otherProps}
            >
                {children}
            </Grid>
        </Grid>
    )
})) /* ============================================================================================================= */
