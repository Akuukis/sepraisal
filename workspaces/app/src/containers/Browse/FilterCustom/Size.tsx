import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'

import Checkbox from './FormControls/Checkbox'
import MyFormGroup from './FormControls/MyFormGroup'
import Slider from './FormControls/Slider'
import SliderLog from './FormControls/SliderLog'


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
        <MyFormGroup className={clsx(classes.root, className)} header='Size' {...otherProps}>
            <Checkbox  title='Large Grid'   criterionId='sbc.gridSize'      yes={{$eq: 'Large'}}          no={{$eq: 'Small'}} />
            <SliderLog title='Block count'  criterionId='sbc.blockCount'    min={0} max={Math.pow(10, 5)} zeroes={{$exists: false}} />
            <SliderLog title='Mass (kg)'    criterionId='sbc.blockMass'     min={0} max={Math.pow(10, 8)} zeroes={{$exists: false}} />
            <Slider    title='Length (m)'   criterionId='sbc.length'        min={0} max={100} step={0.5} />
            <Slider    title='Width (m)'    criterionId='sbc.width'         min={0} max={100} step={0.5} />
            <Slider    title='Height (m)'   criterionId='sbc.height'        min={0} max={100} step={0.5} />
        </MyFormGroup>
    )
})) /* ============================================================================================================= */
