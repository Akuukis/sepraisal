import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'

import MyFormGroup from './FormControls/MyFormGroup'
import SliderLog from './FormControls/SliderLog'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    legend: {
    },
    subheading: {
        margin: theme.spacing(2, 0, 0, 0),
    },
})

interface IProps extends Omit<React.ComponentProps<typeof MyFormGroup>, 'header' | 'subheader'> {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {className, ...otherProps} = props

    return (
        <MyFormGroup className={clsx(classes.root, className)} header='Cost' {...otherProps}>
            <SliderLog title='PCU'                          criterionId='sbc.blockPCU'      min={0} max={Math.pow(10, 5)} zeroes={{$exists: false}} />
            <SliderLog title={'Spent total ore (m\u00B3)'}  criterionId='sbc.oreVolume'     min={0} max={Math.pow(10, 8)} zeroes={{$exists: false}} />
            <Typography component='legend' className={classes.subheading} variant='subtitle1' align='left'>Ores:</Typography>
            <SliderLog title={'Iron Ore (m\u00B3)'}         criterionId='sbc.ores.Iron'     min={0} max={Math.pow(10, 8)} zeroes={{$exists: false}} />
            <SliderLog title={'Nickel Ore (m\u00B3)'}       criterionId='sbc.ores.Nickel'   min={0} max={Math.pow(10, 8)} zeroes={{$exists: false}} />
            <SliderLog title={'Silicon Ore (m\u00B3)'}      criterionId='sbc.ores.Silicon'  min={0} max={Math.pow(10, 8)} zeroes={{$exists: false}} />
            <SliderLog title={'Cobalt Ore (m\u00B3)'}       criterionId='sbc.ores.Cobalt'   min={0} max={Math.pow(10, 8)} zeroes={{$exists: false}} />
            <SliderLog title={'Silver Ore (m\u00B3)'}       criterionId='sbc.ores.Silver'   min={0} max={Math.pow(10, 8)} zeroes={{$exists: false}} />
            <SliderLog title={'Gold Ore (m\u00B3)'}         criterionId='sbc.ores.Gold'     min={0} max={Math.pow(10, 8)} zeroes={{$exists: false}} />
            <SliderLog title={'Platinum Ore (m\u00B3)'}     criterionId='sbc.ores.Iron'     min={0} max={Math.pow(10, 8)} zeroes={{$exists: false}} />
            <Typography component='legend' className={classes.subheading} variant='subtitle1' align='left'>Time:</Typography>
            <SliderLog title={'Time to weld'}               criterionId='sbc.blockTime'     min={0} max={Math.pow(10, 7)} zeroes={{$exists: false}} />
            <SliderLog title={'Time to assemble'}           criterionId='sbc.componentTime' min={0} max={Math.pow(10, 7)} zeroes={{$exists: false}} />
            <SliderLog title={'Time to refine'}             criterionId='sbc.ingotTime'     min={0} max={Math.pow(10, 7)} zeroes={{$exists: false}} />
        </MyFormGroup>
    )
})) /* ============================================================================================================= */
