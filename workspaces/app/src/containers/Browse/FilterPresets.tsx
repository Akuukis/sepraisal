import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { FormControl, FormControlLabel, Radio, RadioGroup } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import MyExpansionPanel from 'src/components/MyExpansionPanel'
import { CONTEXT } from 'src/stores'
import { getPresetTitle, PRESET } from 'src/stores/CardStore'


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
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const cardStore = React.useContext(CONTEXT.CARDS)

    const applyPreset = (event: React.ChangeEvent<HTMLInputElement>) => {
        const id = event.currentTarget.getAttribute('value') as keyof typeof PRESET
        cardStore.querryFindBuilder.replaceQueries(PRESET[id])
    }


    return (
        <MyExpansionPanel header='Presets' subheader={getPresetTitle(cardStore.selectedPreset)} defaultExpanded>
            <FormControl fullWidth>
                <RadioGroup aria-label='preset' name='preset' value={cardStore.selectedPreset} onChange={applyPreset}>
                    {(Object.keys(PRESET) as Array<keyof typeof PRESET>).map((name) => (
                        <FormControlLabel
                            value={name}
                            control={<Radio color='primary' size='small' />}
                            label={getPresetTitle(name as keyof typeof PRESET)}
                        />
                    ))}
                </RadioGroup>
            </FormControl>
        </MyExpansionPanel>
    )
})) /* ============================================================================================================= */
