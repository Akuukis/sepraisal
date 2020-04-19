import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import {
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    List,
    ListItem,
    ListItemText,
    Typography,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { createSmartFC, createStyles, IMyTheme } from '../../../common/'
import { CONTEXT } from '../../../stores'
import { PRESET } from '../../../stores/CardStore'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    content: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
    },
    expanded: {
        margin: '0 !important',
    },
    expansionPanelSummaryHighlight: {
        background: theme.palette.secondary.light,
    },
    heading: {
        flexBasis: '33.33%',
        flexShrink: 0,
        fontSize: theme.typography.pxToRem(15),
    },
    secondaryHeading: {
        color: theme.palette.text.secondary,
        fontSize: theme.typography.pxToRem(15),
    },
})


interface IProps {
    expanded: boolean
    // tslint:disable-next-line: prefer-method-signature
    onChange: () => void
}


export default hot(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {
    const cardStore = React.useContext(CONTEXT.CARDS)

    const presetTitle = getPresetTitle(cardStore.selectedPreset)

    const setFind = (event: React.MouseEvent<HTMLElement>) => {
        const id = event.currentTarget.getAttribute('value') as keyof typeof PRESET
        cardStore.setFind(PRESET[id] as typeof cardStore['find'])
    }

    const renderPreset = (id: keyof typeof PRESET | 'custom') =>
        (
            <ListItem
                button
                selected={cardStore.selectedPreset === id}
                onClick={setFind}
                disabled={id === 'custom'}
                key={id}
                // tslint:disable-next-line: no-any
                {...{value: id} as any}
            >
                <ListItemText primary={getPresetTitle(id)} />
            </ListItem>
        )


    return (
        <ExpansionPanel classes={{root: classes.root, expanded: classes.expanded}} expanded={props.expanded} onChange={props.onChange}>
            <ExpansionPanelSummary className={cardStore.selectedPreset !== 'custom' ? classes.expansionPanelSummaryHighlight : undefined} expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>Presets</Typography>
                <Typography className={classes.secondaryHeading}>{presetTitle}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.content}>
                <List style={{width: '100%'}}>
                    {(Object.keys(PRESET) as Array<keyof typeof PRESET>).map(renderPreset)}
                </List>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    )
})) /* ============================================================================================================= */

const getPresetTitle = (id: keyof typeof PRESET | 'custom') => {
    switch(id) {
        case 'none': return 'None'
        case 'ship': return 'Any ship, vanilla.'
        case 'fighter': return 'Fighter, vanilla.'
        default: return ''
    }
}
