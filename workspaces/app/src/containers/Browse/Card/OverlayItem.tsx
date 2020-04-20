import * as React from 'react'
import { hot } from 'react-hot-loader/root'
import classnames from 'classnames'

import { Grid, GridProps } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../../common/'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        padding: theme.spacing(0.5),
        flex: 1,
    },

    container: {
        color: '#0000',
        width: '100%',
        height: '100%',
        borderColor: `#0000`,
        borderStyle: `dashed`,
        borderWidth: theme.spacing(0.5),
        flexWrap: 'nowrap',
    },

    rootOnHover: {
        backgroundColor: `${theme.palette.secondary.light}40`,
        '&:hover': {
            backgroundColor: `${theme.palette.secondary.light}80`,
        },
    },

    containerOnHover: {
        color: theme.palette.text.disabled,
        borderColor: `${theme.palette.secondary.main}80`,
        '&:hover': {
            color: theme.palette.text.primary,
            borderColor: theme.palette.secondary.main,
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
            {...otherProps}
        >
            <Grid
                container
                alignItems='center'
                justify='center'
                className={classnames({[classes.container]: true, [classes.containerOnHover]: isHover})}
            >
                {children}
            </Grid>
        </Grid>
    )
})) /* ============================================================================================================= */
