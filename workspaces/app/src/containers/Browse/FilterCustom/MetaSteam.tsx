import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { FormGroup, FormLabel } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import MyExpansionPanel from 'src/components/MyExpansionPanel'

import Slider from './FormControls/Slider'
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
        <MyExpansionPanel className={clsx(classes.root, className)} header='Steam' subheader='' {...otherProps}>
            <FormGroup>
                <FormLabel className={classes.legend} component='legend'>
                </FormLabel>
                <Slider    title='Steam stars'             findKey='steam.ratingStars'            min={0} max={5} />
                <SliderLog title='Steam subscribers'       findKey='steam.subscriberCount'        min={0} max={Math.pow(10, 5)} />
                <Slider    title='File size (MB)'          findKey='steam.sizeMB'                 min={0} max={Math.pow(10, 2)} step={0.1} />
            </FormGroup>
        </MyExpansionPanel>
    )
})) /* ============================================================================================================= */
