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
    onChange(): void
}


export default hot(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {
    const cardStore = React.useContext(CONTEXT.CARDS)

    const selectedValue = JSON.stringify(cardStore.find.$and)
    const found = Object.keys(PRESET).findIndex((key) => selectedValue === JSON.stringify(cardStore.sortFindAnd(PRESET[key].$and)))
    const selected = found !== -1 ? Object.keys(PRESET)[found] as keyof typeof PRESET : 'custom'

    const getPresetTitle = (id: keyof typeof PRESET) => {
        switch(id) {
            case 'none': return 'None'
            case 'custom': return 'Custom filter, see below.'
            case 'ship': return 'Any ship, vanilla.'
            case 'fighter': return 'Fighter, vanilla.'
            default: return 'Unknown preset filter.'
        }
    }

    const setFind = (event: React.MouseEvent<HTMLElement>) => {
        const id = event.currentTarget.getAttribute('value') as keyof typeof PRESET
        cardStore.setFind(PRESET[id] as typeof cardStore['find'])
    }

    const renderPreset = (id: keyof typeof PRESET) =>
        (
            <ListItem
                button
                selected={selected === id}
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
        <ExpansionPanel className={classes.root} expanded={props.expanded} onChange={props.onChange}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>Presets</Typography>
                <Typography className={classes.secondaryHeading}>{getPresetTitle(selected)}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.content}>
                <List style={{width: '100%'}}>
                    {(Object.keys(PRESET) as Array<keyof typeof PRESET>).map(renderPreset)}
                </List>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    )
})) /* ============================================================================================================= */
