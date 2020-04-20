import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { IconButton, Typography } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'

import { createSmartFC, createStyles, IMyTheme } from '../../../common/'
import Advanced from './Advanced'
import Custom from './Custom'
import Presets from './Presets'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        paddingBottom: theme.spacing(2),
        position: 'relative',
    },

    closeButton: {
        color: theme.palette.grey[500],
        left: theme.spacing(1),
        position: 'absolute',
        top: theme.spacing(1),
    },
})


interface IProps {
    toggleDrawer(): void,
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {toggleDrawer} = props

    const [expanded, setExpanded] = React.useState<typeof Pages[keyof typeof Pages] | null>(Pages.Presets)
    const setExpandedPage = (page: typeof Pages[keyof typeof Pages]) => () => setExpanded(expanded !== page ? page : null)

    return (
        <div className={classes.root}>
            <Typography variant='h4' align='center' style={{margin: 16}}>Filters</Typography>
            <IconButton aria-label='Close' className={classes.closeButton} onClick={toggleDrawer}>
                <CloseIcon />
            </IconButton>
            <Presets
                expanded={expanded === Pages.Presets}
                onChange={setExpandedPage(Pages.Presets)}
            />
            <Custom
                expanded={expanded === Pages.Custom}
                onChange={setExpandedPage(Pages.Custom)}
            />
            <Advanced
                expanded={expanded === Pages.Advanced}
                onChange={setExpandedPage(Pages.Advanced)}
            />
        </div>
    )
})) /* ============================================================================================================= */


// tslint:disable-next-line: no-object-literal-type-assertion
const Pages = {
    Advanced: 'advanced',
    Custom: 'custom',
    Presets: 'presets',
} as const
