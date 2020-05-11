import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { FormGroup, FormLabel } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import MyExpansionPanel from 'src/components/MyExpansionPanel'

import BlocksSelector from './BlocksSelector'

const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    legend: {
    },

    selector: {
        margin: theme.spacing(1),
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
            </FormGroup>
        </MyExpansionPanel>
    )
})) /* ============================================================================================================= */
