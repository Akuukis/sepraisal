import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import MyExpansionPanel from 'src/components/MyExpansionPanel'
import { CONTEXT } from 'src/stores'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    expanded: {
    },
})


interface IProps {
    no: number
    title: string
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {no, title} = props
    const analyticsStore = React.useContext(CONTEXT.ANALYTICS)
    const [openedOn, setOpenedOn] = React.useState<null | number>(null)

    const trackChange = (event, expanded: boolean) => {
        if(!expanded) {
            analyticsStore.trackEvent(
                'info',
                'faqOpen',
                title,
                undefined,
            )
            setOpenedOn(Date.now())
        } else {
            analyticsStore.trackEvent(
                'info',
                'faqClose',
                title,
                (Date.now() - openedOn!) / 1000,  // tslint:disable-line: no-non-null-assertion
            )
            setOpenedOn(null)
        }
    }

    return (
        <MyExpansionPanel
            header={<><strong>{no}.</strong> {title}</>}
            classes={{root: classes.root, expanded: classes.expanded}}
            onChange={trackChange}
        >
            {children}
        </MyExpansionPanel>
    )
})) /* ============================================================================================================= */
