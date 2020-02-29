import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Typography } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { createSmartFC, createStyles, IMyTheme } from '../../common/'
import { CONTEXT } from '../../stores'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        padding: '0.5em',
    },

    content: {
        display: 'block',
        paddingBottom: '0px',
    },
    expanded: {
    },
})


interface IProps {
    title: string
}


export default hot(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {
    const {title} = props
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
        <ExpansionPanel
            square={false}
            expanded={open}
            classes={{root: classes.root, expanded: classes.expanded}}
        >
            <ExpansionPanelSummary onClick={handleClick} expandIcon={<ExpandMoreIcon />}>
                <Typography variant='subtitle1'><strong>Q:</strong> {title}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.content}>
                {children}
            </ExpansionPanelDetails>
        </ExpansionPanel>
    )
})) /* ============================================================================================================= */
