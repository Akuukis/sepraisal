import { ObservableMap } from '@sepraisal/common/src'
import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { FormGroup } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import MyExpansionPanel from 'src/components/MyExpansionPanel'
import { CONTEXT } from 'src/stores'

import MyFormGroupSubheading from './MyFormGroupSubheading'

const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    legend: {
    },
})

interface IProps extends Omit<React.ComponentProps<typeof MyExpansionPanel>, 'subheader'> {
    header: string
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {className, header, ...otherProps} = props
    const [scope] = React.useState(() => new ObservableMap<boolean | undefined>())

    return (
        <CONTEXT.FORM_GROUP_SCOPE.Provider value={scope}>
            <MyExpansionPanel
                className={clsx(classes.root, className)}
                header={header}
                subheader={<MyFormGroupSubheading />}
                {...otherProps}
            >
                <FormGroup>
                    {children}
                </FormGroup>
            </MyExpansionPanel>
        </CONTEXT.FORM_GROUP_SCOPE.Provider>
    )
})) /* ============================================================================================================= */
