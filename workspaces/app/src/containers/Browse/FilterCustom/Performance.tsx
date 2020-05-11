import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { FormLabel } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'

import Checkbox from './FormControls/Checkbox'
import MyFormGroup from './FormControls/MyFormGroup'


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
        <MyFormGroup className={clsx(classes.root, className)} header='Performance' {...otherProps}>
            <FormLabel className={classes.legend} component='legend'>
            </FormLabel>
            <Checkbox  title='Atmosperic thrusters'    findKey='sbc.thrustAtmospheric.Forward' yes={{$exists: true}} no={{$exists: false}} />
            <Checkbox  title='Ion thrusters'           findKey='sbc.thrustIon.Forward'         yes={{$exists: true}} no={{$exists: false}} />
            <Checkbox  title='Hydrogen thrusters'      findKey='sbc.thrustHydrogen.Forward'    yes={{$exists: true}} no={{$exists: false}} />
            {/* TODO: Average thrust x3 */}
            {/* TODO: Firepower (total DPS) */}
            {/* TODO: Jump Distance */}
            {/* TODO: Cargo capacity */}
            {/* TODO: Hitpoints */}
        </MyFormGroup>
    )
})) /* ============================================================================================================= */
