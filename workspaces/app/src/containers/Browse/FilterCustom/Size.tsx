import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'

import MyFormGroup from './FormControls/MyFormGroup'
import Slider from './FormControls/Slider'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    legend: {
    },
})

interface IProps extends Omit<React.ComponentProps<typeof MyFormGroup>, 'header' | 'subheader'> {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {className, ...otherProps} = props

    return (
        <MyFormGroup className={clsx(classes.root, className)} header='Dimensions' {...otherProps}>
            <Slider    title='Length (m)'   criterionId='sbc.length'        min={0} max={100} step={0.5} />
            <Slider    title='Width (m)'    criterionId='sbc.width'         min={0} max={100} step={0.5} />
            <Slider    title='Height (m)'   criterionId='sbc.height'        min={0} max={100} step={0.5} />
        </MyFormGroup>
    )
})) /* ============================================================================================================= */
