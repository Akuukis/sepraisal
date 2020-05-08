import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { FormGroup, FormLabel } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import MyExpansionPanel from 'src/components/MyExpansionPanel'


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
        <MyExpansionPanel className={clsx(classes.root, className)} header='Blocks' subheader='' {...otherProps}>
            <FormGroup>
                <FormLabel className={classes.legend} component='legend'>
                    TODO
                </FormLabel>
            </FormGroup>
        </MyExpansionPanel>
    )
})) /* ============================================================================================================= */
