import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'

import Checkbox from './FormControls/Checkbox'
import MyFormGroup from './FormControls/MyFormGroup'
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
            <Checkbox  title='Large Grid'                  findKey='sbc.gridSize'                 yes={{$eq: 'Large'}}        no={{$eq: 'Small'}} />
            <SliderLog title='Block count'                 findKey='sbc.blockCount'               min={0} max={Math.pow(10, 5)} zeroes={{$exists: false}} />
            <SliderLog title='Mass (kg)'                   findKey='sbc.blockMass'                min={0} max={Math.pow(10, 8)} zeroes={{$exists: false}} />
            {/* <Slider    title='Length (m)' operator='$size' findKey='sbc.integrityPlanes.front'    min={0} max={100} step={0.5} /> */}
            {/* <Slider    title='Width (m)'  operator='$size' findKey='sbc.integrityPlanes.top'      min={0} max={100} step={0.5} /> */}
            {/* <Slider    title='Height (m)' operator='$size' findKey='sbc.integrityPlanes.side'     min={0} max={100} step={0.5} /> */}
        </MyFormGroup>
    )
})) /* ============================================================================================================= */
