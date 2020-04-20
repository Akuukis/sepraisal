import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import {
    List,
    ListItem,
    ListItemText,
} from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../../common/'
import { CONTEXT } from '../../../stores'
import { PRESET } from '../../../stores/CardStore'
import MyExpansionPanel from '../../../components/MyExpansionPanel'


const styles = (theme: IMyTheme) => createStyles({
    root: {
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


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {expanded, onChange} = props
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
        <MyExpansionPanel title='Presets' subtitle={getTitle(cardStore.selectedPreset)} expanded={expanded} onChange={onChange}>
            <List className={classes.list}>
                {(Object.keys(PRESET) as Array<keyof typeof PRESET>).map(renderPreset)}
            </List>
        </MyExpansionPanel>
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
