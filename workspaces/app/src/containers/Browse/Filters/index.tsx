import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { IconButton, Typography } from '@material-ui/core'
import CloseIcon from '@material-ui/icons/Close'

import { createSmartFC, createStyles, IMyTheme } from '../../../common/'
import { CONTEXT } from '../../../stores'
import { PRESET } from '../../../stores/CardStore'
import Advanced from './Advanced'
import Custom from './Custom'
import Presets from './Presets'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        paddingBottom: theme.spacing(2),
        position: 'relative',
    },

    closeButton: {
        position: 'absolute',
        left: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
})


interface IProps {
    toggleDrawer(): void,
}


export default hot(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {
    const {toggleDrawer} = props

    const cardStore = React.useContext(CONTEXT.CARDS)
    const [expanded, setExpanded] = React.useState<typeof Pages[keyof typeof Pages]>(Pages.Presets)

    const setExpandedPage = (page) => () => setExpanded(expanded !== page ? page : null)

    const selectedValue = JSON.stringify(cardStore.find)
    const found = Object.keys(PRESET).findIndex((key) => selectedValue === JSON.stringify(PRESET[key]))

    return (
        <div className={classes.root}>
            <Typography variant='h4' align='center' style={{margin: 16}}>Filters</Typography>
            <IconButton aria-label="Close" className={classes.closeButton} onClick={toggleDrawer}>
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
