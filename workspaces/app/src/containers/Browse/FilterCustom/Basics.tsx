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
        <MyFormGroup className={clsx(classes.root, className)} header='Basics' {...otherProps}>
            <Checkbox  title='Vanilla'                 criterionId='sbc.vanilla'                   yes={{$eq: true}}     no={{$eq: false}} />
            <Checkbox  title='Large Grid'              criterionId='sbc.gridSize'                  yes={{$eq: 'Large'}}  no={{$eq: 'Small'}} />
            <Checkbox  title='Static Grid'             criterionId='sbc.gridStatic'                yes={{$eq: true}}     no={{$eq: false}} />
            <Checkbox  title='Printable (no subgrids)' criterionId='sbc.gridCount'                 yes={{$eq: 1}}        no={{$ne: 1}} />
            <SliderLog title='PCU'                     criterionId='sbc.blockPCU'                  min={0} max={Math.pow(10, 5)} zeroes={{$exists: false}} />
        </MyFormGroup>
    )
})) /* ============================================================================================================= */
