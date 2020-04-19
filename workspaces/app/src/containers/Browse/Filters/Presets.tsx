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
    heading: {
        flexBasis: '33.33%',
        flexShrink: 0,
        lineHeight: 1,
        fontSize: theme.typography.pxToRem(16),
    },
    secondaryHeading: {
        color: theme.palette.primary.main,
        fontWeight: 500,
        lineHeight: 1,
        fontSize: theme.typography.pxToRem(16),
    },
    list: {
        width: '100%',
    },
    listItem: {
        '&:hover': {
            backgroundColor: `#e7eff6 !important`,  // 9 times lighter.
        }
    },
    listItemSelected: {
        '&:hover': {
            backgroundColor: `${theme.palette.primary.light} !important`,
        },
        backgroundColor: `${theme.palette.primary.light} !important`,
    },
})


interface IProps {
    expanded: boolean
    // tslint:disable-next-line: prefer-method-signature
    onChange: () => void
}


export default hot(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {
    const cardStore = React.useContext(CONTEXT.CARDS)

    const setFind = (event: React.MouseEvent<HTMLElement>) => {
        const id = event.currentTarget.getAttribute('value') as keyof typeof PRESET
        cardStore.setFind(PRESET[id] as typeof cardStore['find'])
    }

    const renderPreset = (id: keyof typeof PRESET | 'custom') =>
        (
            <ListItem
                classes={{root: classes.listItem, selected: classes.listItemSelected}}
                button
                selected={cardStore.selectedPreset === id}
                onClick={setFind}
                disabled={id === 'custom'}
                key={id}
                // tslint:disable-next-line: no-any
                {...{value: id} as any}
            >
                <ListItemText primary={getTitle(id)} />
            </ListItem>
        )


    return (
        <ExpansionPanel classes={{root: classes.root, expanded: classes.expanded}} expanded={props.expanded} onChange={props.onChange}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading} variant='h3'>Presets</Typography>
                <Typography component='span' className={classes.secondaryHeading}>{getTitle(cardStore.selectedPreset)}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.content}>
                <List className={classes.list}>
                    {(Object.keys(PRESET) as Array<keyof typeof PRESET>).map(renderPreset)}
                </List>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    )
})) /* ============================================================================================================= */

const getTitle = (id: keyof typeof PRESET | 'custom') => {
    switch(id) {
        case 'none': return 'None'
        case 'ship': return 'Any ship, vanilla.'
        case 'fighter': return 'Fighter, vanilla.'
        default: return ''
    }
}
