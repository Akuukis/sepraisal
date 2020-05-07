import { IBlueprint } from '@sepraisal/common'
import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { createSmartFC, createStyles, IMyTheme } from '../../common/'
import MyBoxColumn from '../MyBoxColumn'
import MySection from './MySection'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        opacity: 0.4,
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
            className={clsx(classes.root, className)}
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
