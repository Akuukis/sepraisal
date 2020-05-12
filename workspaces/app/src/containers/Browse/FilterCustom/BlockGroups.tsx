import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { FormLabel } from '@material-ui/core'

import { BLOCK_GROUPS, createSmartFC, createStyles, IMyTheme } from 'src/common'

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
        <MyFormGroup className={clsx(classes.root, className)} header='Block Groups' {...otherProps}>
            <FormLabel className={classes.legend} component='legend'>
                TODO
            </FormLabel>
            {Object.entries(BLOCK_GROUPS).map(([groupId, fullIds]) => (
                <Checkbox
                    title={BLOCK_GROUP_NAMES[groupId]}
                    criterionId={fullIds.map((fullId) => `sbc.blocks.${fullId}`)}
                    yes={{$exists: true}}
                    no={{$exists: false}}
                />
            ))}
        </MyFormGroup>
    )
})) /* ============================================================================================================= */

const BLOCK_GROUP_NAMES: Record<keyof typeof BLOCK_GROUPS, string> = {
    POWER_BATTERY           : 'Any Power (battery)',
    POWER_ENGINE            : 'Any Power (reactor, engine)',
    POWER                   : 'Any Power',
    COCKPIT_CLOSED          : 'Any Cockpit (closed)',
    COCKPIT_OPEN            : 'Any Cockpit (open)',
    COCKPIT                 : 'Any Cockpit',
    THRUSTER_ATMOSPHERIC    : 'Any Thruster (atmospheric)',
    THRUSTER_ION            : 'Any Thruster (ion)',
    THRUSTER_HYDROGEN       : 'Any Thruster (hydrogen)',
    THRUSTER                : 'Any Thruster',
    WEAPON_TURRET           : 'Any Weapon (turrets)',
    WEAPON_FIXED            : 'Any Weapon (fixed)',
    WEAPON                  : 'Any Weapon',
    RESPAWN                 : 'Any Respawn (medical, survival kit)',
    RENEWABLES              : 'Any Renewables (solar, wind)',
}
