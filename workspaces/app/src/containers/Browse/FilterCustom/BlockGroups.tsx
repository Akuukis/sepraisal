import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { FormLabel } from '@material-ui/core'

import { BLOCK_GROUPS, createSmartFC, createStyles, IMyTheme } from 'src/common'

import CheckboxMulti from './FormControls/CheckboxMulti'
import MyFormGroup from './FormControls/MyFormGroup'

const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    legend: {
    },

    checkbox: {
    },
    checkboxParent: {
        marginTop: theme.spacing(2),
    },
    checkboxChildren: {
        paddingLeft: theme.spacing(8),
    },
})

interface IProps extends Omit<React.ComponentProps<typeof MyFormGroup>, 'header' | 'subheader'> {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {className, ...otherProps} = props

    return (
        <MyFormGroup className={clsx(classes.root, className)} header='Block Groups' {...otherProps}>
            <FormLabel className={classes.legend} component='legend'>
            </FormLabel>
            {Object.entries(BLOCK_GROUPS).map(([groupId, fullIds]) => (
                <CheckboxMulti
                    key={groupId}
                    className={clsx(classes.checkbox, groupId.includes('_') ? classes.checkboxChildren : classes.checkboxParent)}
                    label={BLOCK_GROUP_NAMES[groupId]}
                    criterionIds={fullIds.map((fullId) => `sbc.blocks.${fullId}`)}
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
    WHEELS                  : 'Any Wheels (suspensions)',
    THRUSTER_ATMOSPHERIC    : 'Any Thruster (atmospheric)',
    THRUSTER_ION            : 'Any Thruster (ion)',
    THRUSTER_HYDROGEN       : 'Any Thruster (hydrogen)',
    THRUSTER                : 'Any Thruster',
    TOOL_DRILL              : 'Any Drill',
    TOOL_WELDER             : 'Any Welder',
    TOOL_GRINDER            : 'Any Grinder',
    TOOL                    : 'Any Tool',
    WEAPON_TURRET           : 'Any Weapon (turrets)',
    WEAPON_FIXED            : 'Any Weapon (fixed)',
    WEAPON                  : 'Any Weapon',
    GYRO                    : 'Any Gyroscope',
    RESPAWN                 : 'Any Respawn (medical, survival kit)',
    RENEWABLES              : 'Any Renewables (solar, wind)',
    PROTOTECH               : 'Any Prototech',
}
