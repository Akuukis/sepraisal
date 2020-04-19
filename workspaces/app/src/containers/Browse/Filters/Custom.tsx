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
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
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


export default hot(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) =>

    (
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
                    <Slider    title='Steam stars'             findKey='steam.ratingStars'            min={0} max={5} />
                    <SliderLog title='Steam subscribers'       findKey='steam.subscriberCount'        min={0} max={Math.pow(10, 5)} />
                    <Slider    title='File size (MB)'          findKey='steam.sizeMB'                 min={0} max={Math.pow(10, 2)} step={0.1} />
                </FormGroup>
                <FormGroup>
                    <FormLabel component='legend' style={{textAlign: 'right'}}>by Size</FormLabel>
                    <Checkbox  title='Large Grid'                  findKey='sbc.gridSize'                 yes={{$eq: 'Large'}}        no={{$eq: 'Small'}} />
                    <SliderLog title='PCU'                         findKey='sbc.blockPCU'                 min={0} max={Math.pow(10, 5)} zeroes={{$exists: false}} />
                    <SliderLog title='Block count'                 findKey='sbc.blockCount'               min={0} max={Math.pow(10, 5)} zeroes={{$exists: false}} />
                    <SliderLog title='Mass (kg)'                   findKey='sbc.blockMass'                min={0} max={Math.pow(10, 8)} zeroes={{$exists: false}} />
                    <SliderLog title={'Spent total ore (m\u00B3)'} findKey='sbc.oreVolume'                min={0} max={Math.pow(10, 8)} zeroes={{$exists: false}} />
                    <Slider    title='Length (m)' operator='$size' findKey='sbc.integrityPlanes.front'    min={0} max={100} step={0.5} />
                    <Slider    title='Width (m)'  operator='$size' findKey='sbc.integrityPlanes.top'      min={0} max={100} step={0.5} />
                    <Slider    title='Height (m)' operator='$size' findKey='sbc.integrityPlanes.side'     min={0} max={100} step={0.5} />
                </FormGroup>
                <FormGroup>
                    <FormLabel component='legend' style={{textAlign: 'right'}}>by Cost</FormLabel>
                    <SliderLog title={'Iron Ore (m\u00B3)'}              findKey='sbc.ores.Iron'                 min={0} max={Math.pow(10, 8)} zeroes={{$exists: false}} />
                    <SliderLog title={'Nickel Ore (m\u00B3)'}            findKey='sbc.ores.Nickel'               min={0} max={Math.pow(10, 8)} zeroes={{$exists: false}} />
                    <SliderLog title={'Silicon Ore (m\u00B3)'}           findKey='sbc.ores.Silicon'              min={0} max={Math.pow(10, 8)} zeroes={{$exists: false}} />
                    <SliderLog title={'Cobalt Ore (m\u00B3)'}            findKey='sbc.ores.Cobalt'               min={0} max={Math.pow(10, 8)} zeroes={{$exists: false}} />
                    <SliderLog title={'Silver Ore (m\u00B3)'}            findKey='sbc.ores.Silver'               min={0} max={Math.pow(10, 8)} zeroes={{$exists: false}} />
                    <SliderLog title={'Gold Ore (m\u00B3)'}              findKey='sbc.ores.Gold'                 min={0} max={Math.pow(10, 8)} zeroes={{$exists: false}} />
                    <SliderLog title={'Platinum Ore (m\u00B3)'}          findKey='sbc.ores.Iron'                 min={0} max={Math.pow(10, 8)} zeroes={{$exists: false}} />
                </FormGroup>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    ))) /* ============================================================================================================= */
