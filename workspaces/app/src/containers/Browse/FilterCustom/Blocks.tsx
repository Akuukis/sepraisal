import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { FormLabel } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'

import BlocksSelector from './FormControls/BlocksSelector'
import Checkbox from './FormControls/Checkbox'
import MyFormGroup from './FormControls/MyFormGroup'

const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    legend: {
    },

    selector: {
        margin: theme.spacing(1),
    },
})

interface IProps extends Omit<React.ComponentProps<typeof MyFormGroup>, 'header' | 'subheader'> {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {className, ...otherProps} = props

    return (
        <MyFormGroup className={clsx(classes.root, className)} header='Blocks' {...otherProps}>
            <FormLabel className={classes.legend} component='legend'>
                TODO
            </FormLabel>
            <BlocksSelector
                variant='include'
                heading='MUST include all of these blocks'
                classes={{
                    root: classes.selector,
                }}
            />
            <BlocksSelector
                variant='exclude'
                heading='MUST NOT include any of these blocks'
                classes={{
                    root: classes.selector,
                }}
            />
            <Checkbox
                title='Any power source'
                criterionId={[
                    'sbc.blocks.BatteryBlock/SmallBlockBatteryBlock',
                    'sbc.blocks.Reactor/SmallBlockSmallGenerator',
                    'sbc.blocks.Reactor/SmallBlockLargeGenerator',
                ]}
                yes={{$exists: true}}
            />

        </MyFormGroup>
    )
})) /* ============================================================================================================= */
