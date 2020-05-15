import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Fab, GridProps, Hidden } from '@material-ui/core'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        position: 'fixed',
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
})


interface IProps extends GridProps {
    aside?: React.ReactNode,
    asideIcon?: React.ReactNode,
    toggleOpen: () => void,
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {aside, asideIcon, toggleOpen, className, ...otherProps} = props

    const icon = asideIcon ?? (theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />)

    if(!aside) return null

    return (
        <Hidden smUp implementation='css'>
            <Fab
                className={classes.root}
                color='primary'
                aria-label='edit'
                onClick={toggleOpen}
            >
                {icon}
            </Fab>
        </Hidden>
    )
})) /* ============================================================================================================= */

const drawerWidth = 420
const buttonWidth = 40
