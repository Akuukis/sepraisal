import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import {
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    FormGroup,
    FormLabel,
    Typography,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { createSmartFC, createStyles, IMyTheme } from '../../../common/'
import Checkbox from './FormControls/Checkbox'
import Slider from './FormControls/Slider'
import SliderLog from './FormControls/SliderLog'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    content: {
        flexDirection: 'column',
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
                    <FormLabel component='legend' style={{textAlign: 'right'}}>by Basics</FormLabel>
                    <Typography color='textSecondary' variant='caption'>
                        [-]: disabled filter,   [x]: positive filer,   [ ]: negative filter
                    </Typography>
                    <Checkbox  title='Vanilla'                 findKey='sbc.vanilla'                   yes                   no={false} />
                    <Checkbox  title='Printable (no subgrids)' findKey='sbc.gridCount'                 yes={{$eq: 1}}        no={{$ne: 1}} />
                    <Checkbox  title='Static Grid'             findKey='sbc.gridStatic'                yes                   no={false} />
                    <Checkbox  title='Atmosperic thrusters'    findKey='sbc.thrustAtmospheric.Forward' yes={{$exists: true}} no={{$exists: false}} />
                    <Checkbox  title='Ion thrusters'           findKey='sbc.thrustIon.Forward'         yes={{$exists: true}} no={{$exists: false}} />
                    <Checkbox  title='Hydrogen thrusters'      findKey='sbc.thrustHydrogen.Forward'    yes={{$exists: true}} no={{$exists: false}} />
                </FormGroup>
                <FormGroup>
                    <FormLabel component='legend' style={{textAlign: 'right'}}>by Steam Workshop</FormLabel>
                    <Slider    title='Steam stars'             findKey='steam.ratingStars'            min={0} max={5} zeroes={{$exists: false}} />
                    <SliderLog title='Steam subscribers'       findKey='steam.subscriberCount'        min={0} max={Math.pow(10, 5)} zeroes={{$exists: false}} />
                    <SliderLog title='File size'               findKey='steam.sizeMB'                 min={0} max={Math.pow(10, 3)} zeroes={{$exists: false}} />
                </FormGroup>
                <FormGroup>
                    <FormLabel component='legend' style={{textAlign: 'right'}}>by Size</FormLabel>
                    <Checkbox  title='Large Grid'              findKey='sbc.gridSize'                 yes={{$eq: 'Large'}}        no={{$eq: 'Small'}} />
                    <SliderLog title='PCU'                     findKey='sbc.blockPCU'                 min={0} max={Math.pow(10, 5)} zeroes={{$exists: false}} />
                    <SliderLog title='Block count'             findKey='sbc.blockCount'               min={0} max={Math.pow(10, 5)} zeroes={{$exists: false}} />
                    <SliderLog title='Mass'                    findKey='sbc.blockMass'                min={0} max={Math.pow(10, 8)} zeroes={{$exists: false}} />
                    <SliderLog title='Spent ore volume'        findKey='sbc.oreVolume'                min={0} max={Math.pow(10, 8)} zeroes={{$exists: false}} />
                </FormGroup>
                <FormGroup>
                    <FormLabel component='legend' style={{textAlign: 'right'}}>by Cost</FormLabel>
                    <SliderLog title='Iron Ore'              findKey='sbc.ores.Iron'                 min={0} max={Math.pow(10, 8)} zeroes={{$exists: false}} />
                    <SliderLog title='Nickel Ore'            findKey='sbc.ores.Nickel'               min={0} max={Math.pow(10, 8)} zeroes={{$exists: false}} />
                    <SliderLog title='Silicon Ore'           findKey='sbc.ores.Silicon'              min={0} max={Math.pow(10, 8)} zeroes={{$exists: false}} />
                    <SliderLog title='Cobalt Ore'            findKey='sbc.ores.Cobalt'               min={0} max={Math.pow(10, 8)} zeroes={{$exists: false}} />
                    <SliderLog title='Silver Ore'            findKey='sbc.ores.Silver'               min={0} max={Math.pow(10, 8)} zeroes={{$exists: false}} />
                    <SliderLog title='Gold Ore'              findKey='sbc.ores.Gold'                 min={0} max={Math.pow(10, 8)} zeroes={{$exists: false}} />
                    <SliderLog title='Platinum Ore'          findKey='sbc.ores.Iron'                 min={0} max={Math.pow(10, 8)} zeroes={{$exists: false}} />
                </FormGroup>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    )
})) /* ============================================================================================================= */
