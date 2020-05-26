import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { FormLabel } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'

import MyFormGroup from './FormControls/MyFormGroup'
import Slider from './FormControls/Slider'
import SliderDate from './FormControls/SliderDate'
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
        <MyFormGroup className={clsx(classes.root, className)} header='Steam' {...otherProps}>
            <FormLabel className={classes.legend} component='legend'>
            </FormLabel>
            <Slider     title='Steam stars'          criterionId='steam.ratingStars'          min={0} max={5} />
            <SliderLog  title='Steam subscribers'    criterionId='steam.subscriberCount'      min={0} max={Math.pow(10, 5)} />
            <SliderLog  title='Steam views'          criterionId='steam.viewCount'            min={0} max={Math.pow(10, 5)} />
            <SliderLog  title='Steam favorites'      criterionId='steam.favoriteCount'        min={0} max={Math.pow(10, 5)} />
            <Slider     title='File size (MB)'       criterionId='steam.sizeMB'               min={0} max={50} step={0.1} />
            <SliderDate title='Last Updated Date'    criterionId='steam.updatedDate' />
            <SliderDate title='Posted Date'          criterionId='steam.postedDate' />
            {/* TODO: No Description */}
            {/* TODO: Status (by tags) */}
            {/* TODO: Published date */}
            {/* TODO: Updated date */}
        </MyFormGroup>
    )
})) /* ============================================================================================================= */
