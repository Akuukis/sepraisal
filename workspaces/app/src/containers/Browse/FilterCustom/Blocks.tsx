import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { FormGroup, FormLabel } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import MyExpansionPanel from 'src/components/MyExpansionPanel'
import { CONTEXT } from 'src/stores'

import BlocksSelector from './BlocksSelector'

const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    legend: {
    },

    selector: {
        margin: theme.spacing(1),
    },
    excludeHeader: {
        backgroundColor: theme.palette.error.light,
    },
    excludeChip: {
        backgroundColor: theme.palette.error.light,
    },
    includeHeader: {
        backgroundColor: theme.palette.success.light,
    },
    includeChip: {
        backgroundColor: theme.palette.success.light,
    }
})

interface IProps extends Omit<React.ComponentProps<typeof MyExpansionPanel>, 'header' | 'subheader'> {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {className, ...otherProps} = props
    const praisalManager = React.useContext(CONTEXT.PRAISAL_MANAGER)
    const cubeNames = [...praisalManager.cubes.keys()]

    return (
        <MyExpansionPanel className={clsx(classes.root, className)} header='Blocks' subheader='' {...otherProps}>
            <FormGroup>
                <FormLabel className={classes.legend} component='legend'>
                    TODO
                </FormLabel>
                <BlocksSelector
                    heading='MUST include all of these blocks'
                    classes={{
                        root: classes.selector,
                        header: classes.includeHeader,
                        chip: classes.includeChip,
                    }}
                />
                <BlocksSelector
                    heading='MUST NOT include any of these blocks'
                    classes={{
                        root: classes.selector,
                        header: classes.excludeHeader,
                        chip: classes.excludeChip,
                    }}
                />
            </FormGroup>
        </MyExpansionPanel>
    )
})) /* ============================================================================================================= */
