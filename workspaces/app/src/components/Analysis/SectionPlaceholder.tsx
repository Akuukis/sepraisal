import { IBlueprint } from '@sepraisal/common'
import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { fade } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'

import MyBoxColumn from '../MyBoxColumn'
import MySection from './MySection'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },
    inner: {
        backgroundColor: fade(theme.palette.background.default, 0.5),
    },
    box: {
        backgroundColor: 'transparent',
    },
})


interface IProps extends Omit<React.ComponentProps<typeof MySection>, 'heading' | 'value' | 'label'> {
    long?: boolean
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {className, long, ...otherProps} = props

    return (
        <MySection
            heading=''
            label=''
            value=''
            MyBoxColumnProps={{style: {display: 'none'}}}
            classes={{
                root: clsx(classes.root, className),
                inner: classes.inner,
            }}
            {...otherProps}
        >
            <MyBoxColumn height={long ? 4 : 2} width={6} />
        </MySection>
    )
})) /* ============================================================================================================= */


type ProjectionCardSteam =
    | 'description'
    | 'id'

interface IBpProjectionRow {
    steam: {[key in keyof Pick<IBlueprint.ISteam, ProjectionCardSteam>]: IBlueprint.ISteam[key]}
}
