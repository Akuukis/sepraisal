import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { FormGroup, FormLabel } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import MyExpansionPanel from 'src/components/MyExpansionPanel'

import Checkbox from './FormControls/Checkbox'
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
        <MyExpansionPanel className={clsx(classes.root, className)} header='Basics' subheader='' {...otherProps}>
            <FormGroup>
                <FormLabel className={classes.legend} component='legend'>
                    [-]: disabled filter,   [x]: positive filer,   [ ]: negative filter
                </FormLabel>
                <Checkbox  title='Vanilla'                 findKey='sbc.vanilla'                   yes                   no={false} />
                <Checkbox  title='Large Grid'              findKey='sbc.gridSize'                  yes={{$eq: 'Large'}}  no={{$eq: 'Small'}} />
                <Checkbox  title='Static Grid'             findKey='sbc.gridStatic'                yes                   no={false} />
                <Checkbox  title='Printable (no subgrids)' findKey='sbc.gridCount'                 yes={{$eq: 1}}        no={{$ne: 1}} />
                <SliderLog title='PCU'                     findKey='sbc.blockPCU'                  min={0} max={Math.pow(10, 5)} zeroes={{$exists: false}} />
            </FormGroup>
        </MyExpansionPanel>
    )
})) /* ============================================================================================================= */
