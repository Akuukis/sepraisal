import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Divider, FormGroup, FormLabel } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import MyExpansionPanel from 'src/components/MyExpansionPanel'

import SliderLog from './FormControls/SliderLog'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    legend: {
    },
})

interface IProps extends Omit<React.ComponentProps<typeof MyExpansionPanel>, 'header' | 'subheader'> {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {className, ...otherProps} = props

    return (
        <MyExpansionPanel className={clsx(classes.root, className)} header='Cost' subheader='' {...otherProps}>
            <FormGroup>
                <FormLabel className={classes.legend} component='legend'>
                </FormLabel>
                <SliderLog title='PCU'                          findKey='sbc.blockPCU'      min={0} max={Math.pow(10, 5)} zeroes={{$exists: false}} />
                <SliderLog title={'Spent total ore (m\u00B3)'}  findKey='sbc.oreVolume'     min={0} max={Math.pow(10, 8)} zeroes={{$exists: false}} />
                <Divider />
                <SliderLog title={'Iron Ore (m\u00B3)'}         findKey='sbc.ores.Iron'     min={0} max={Math.pow(10, 8)} zeroes={{$exists: false}} />
                <SliderLog title={'Nickel Ore (m\u00B3)'}       findKey='sbc.ores.Nickel'   min={0} max={Math.pow(10, 8)} zeroes={{$exists: false}} />
                <SliderLog title={'Silicon Ore (m\u00B3)'}      findKey='sbc.ores.Silicon'  min={0} max={Math.pow(10, 8)} zeroes={{$exists: false}} />
                <SliderLog title={'Cobalt Ore (m\u00B3)'}       findKey='sbc.ores.Cobalt'   min={0} max={Math.pow(10, 8)} zeroes={{$exists: false}} />
                <SliderLog title={'Silver Ore (m\u00B3)'}       findKey='sbc.ores.Silver'   min={0} max={Math.pow(10, 8)} zeroes={{$exists: false}} />
                <SliderLog title={'Gold Ore (m\u00B3)'}         findKey='sbc.ores.Gold'     min={0} max={Math.pow(10, 8)} zeroes={{$exists: false}} />
                <SliderLog title={'Platinum Ore (m\u00B3)'}     findKey='sbc.ores.Iron'     min={0} max={Math.pow(10, 8)} zeroes={{$exists: false}} />
                <Divider />
                <SliderLog title={'Time to weld'}               findKey='sbc.blockTime'     min={0} max={Math.pow(10, 7)} zeroes={{$exists: false}} />
                <SliderLog title={'Time to assemble'}           findKey='sbc.componentTime' min={0} max={Math.pow(10, 7)} zeroes={{$exists: false}} />
                <SliderLog title={'Time to refine'}             findKey='sbc.ingotTime'     min={0} max={Math.pow(10, 7)} zeroes={{$exists: false}} />
            </FormGroup>
        </MyExpansionPanel>
    )
})) /* ============================================================================================================= */
