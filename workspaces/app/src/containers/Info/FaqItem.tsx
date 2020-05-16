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
    const piwikStore = React.useContext(CONTEXT.PIWIK)
    const [openedOn, setOpenedOn] = React.useState<null | number>(null)
    const [open, setOpen] = React.useState(false)

    const handleClick = () => {
        if(!open) {
            piwikStore.push([
                'trackEvent',
                'info',
                'faq-open',
                title,
                undefined,
            ])
            setOpenedOn(Date.now())
        } else {
            piwikStore.push([
                'trackEvent',
                'info',
                'faq-close',
                title,
                (Date.now() - openedOn!) / 1000,  // tslint:disable-line: no-non-null-assertion
            ])
            setOpenedOn(null)
        }
        setOpen(!open)
    }

    return (
        <MyExpansionPanel
            header={<><strong>{no}.</strong> {title}</>}
            classes={{root: classes.root, expanded: classes.expanded}}
        >
            {children}
        </MyExpansionPanel>
    )
})) /* ============================================================================================================= */
