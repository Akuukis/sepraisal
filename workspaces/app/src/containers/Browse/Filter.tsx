import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Divider } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'

import FilterCustom from './FilterCustom'
import FilterPresets from './FilterPresets'
import FilterRaw from './FilterRaw'


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
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const [expanded, setExpanded] = React.useState<typeof Pages[keyof typeof Pages] | null>(Pages.Presets)
    const setExpandedPage = (page: typeof Pages[keyof typeof Pages]) => () => setExpanded(expanded !== page ? page : null)

    return (
        <div className={classes.root}>
            <FilterPresets
                expanded={expanded === Pages.Presets}
                onChange={setExpandedPage(Pages.Presets)}
            />
            <Divider />
            <FilterCustom
                expanded={expanded === Pages.Custom}
                onChange={setExpandedPage(Pages.Custom)}
            />
            <Divider />
            <FilterRaw
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
