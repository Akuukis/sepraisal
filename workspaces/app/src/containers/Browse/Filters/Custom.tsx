import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, FormGroup, Typography } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { createSmartFC, createStyles, IMyTheme } from '../../../common/'
import Checkbox from './FormControls/Checkbox'


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
    onChange: () => void
}


export default hot(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {

    return (
        <ExpansionPanel className={classes.root} expanded={props.expanded} onChange={props.onChange}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>Custom</Typography>
                <Typography className={classes.secondaryHeading}/>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.content}>
                <FormGroup>
                    <Typography color='textSecondary' variant='caption'>
                        [-]: disabled filter,   [x]: positive filer,   [ ]: negative filter
                    </Typography>
                    <Checkbox title='Vanilla'               findKey='sbc.vanilla'                   yes                   no={false} />
                    <Checkbox title='Static Grid'           findKey='sbc.gridStatic'                yes                   no={false} />
                    <Checkbox title='No subgrids'           findKey='sbc.gridCount'                 yes={{$eq: 1}}        no={{$ne: 1}} />
                    <Checkbox title='No Image'              findKey='thumb.webp'                    yes={null}            no={{$ne: null}} />
                    <Checkbox title='Requires Gold ore'     findKey='sbc.ores.Gold'                 yes={{$exists: true}} no={{$exists: false}} />
                    <Checkbox title='Requires Platinum ore' findKey='sbc.ores.Platinum'             yes={{$exists: true}} no={{$exists: false}} />
                    <Checkbox title='Requires Cobalt ore'   findKey='sbc.ores.Cobalt'               yes={{$exists: true}} no={{$exists: false}} />
                    <Checkbox title='Requires Silver ore'   findKey='sbc.ores.Silver'               yes={{$exists: true}} no={{$exists: false}} />
                    <Checkbox title='Atmosperic thrusters'  findKey='sbc.thrustAtmospheric.Forward' yes={{$exists: true}} no={{$exists: false}} />
                    <Checkbox title='Ion thrusters'         findKey='sbc.thrustIon.Forward'         yes={{$exists: true}} no={{$exists: false}} />
                    <Checkbox title='Hydrogen thrusters'    findKey='sbc.thrustHydrogen.Forward'    yes={{$exists: true}} no={{$exists: false}} />

                </FormGroup>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    )
})) /* ============================================================================================================= */
