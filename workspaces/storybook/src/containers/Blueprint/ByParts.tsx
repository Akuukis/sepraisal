import RowBlocks from '@sepraisal/app/lib/containers/Blueprint/RowBlocks'
import RowHeader from '@sepraisal/app/lib/containers/Blueprint/RowHeader'
import RowIngotsOres from '@sepraisal/app/lib/containers/Blueprint/RowIngotsOres'
import RowIntegrity from '@sepraisal/app/lib/containers/Blueprint/RowIntegrity'
import RowMobility from '@sepraisal/app/lib/containers/Blueprint/RowMobility'
import RowWorkshop from '@sepraisal/app/lib/containers/Blueprint/RowWorkshop'
import { withKnobs } from '@storybook/addon-knobs'
import { storiesOf } from '@storybook/react'
import * as React from 'react'

import { Grid } from '@material-ui/core'

import { Aegir1 } from '../../../blueprints/Aegir1'
import { Aegir2 } from '../../../blueprints/Aegir2'
import { Aragath } from '../../../blueprints/Aragath'
import { Wyvern } from '../../../blueprints/Wyvern'
import { GridDecorator } from '../../GridDecorator'
import Theme from '../../ThemeDecorator'


storiesOf('Analysis|By Parts', module)
    .addDecorator(Theme('my'))
    .addDecorator(withKnobs)
    .addDecorator(GridDecorator())
    .add('Header', () => (
        <Grid container style={{width: '536px'}} spacing={8}>
            <RowHeader width={12} bp={Wyvern} />
            <RowHeader width={12} bp={Aegir1} />
            <RowHeader width={12} bp={Aegir2} />
            <RowHeader width={12} bp={Aragath} />
        </Grid>
    ))
    .add('Workshop', () => (
        <Grid container style={{width: '536px'}} spacing={8}>
            <RowWorkshop width={12} bp={Wyvern} />
            <RowWorkshop width={12} bp={Aegir1} />
            <RowWorkshop width={12} bp={Aegir2} />
            <RowWorkshop width={12} bp={Aragath} />
        </Grid>
    ))
    .add('Integrity', () => (
        <Grid container style={{width: '536px'}} spacing={8}>
            <RowIntegrity width={12} bp={Wyvern} />
            <RowIntegrity width={12} bp={Aegir1} />
            <RowIntegrity width={12} bp={Aegir2} />
            <RowIntegrity width={12} bp={Aragath} />
        </Grid>
    ))
    .add('Mobility', () => (
        <Grid container style={{width: '536px'}} spacing={8}>
            <RowMobility width={12} bp={Wyvern} />
            <RowMobility width={12} bp={Aegir1} />
            <RowMobility width={12} bp={Aegir2} />
            <RowMobility width={12} bp={Aragath} />
        </Grid>
    ))
    .add('Blocks', () => (
        <Grid container style={{width: '536px'}} spacing={8}>
            <RowBlocks width={12} bp={Wyvern} />
            <RowBlocks width={12} bp={Aegir1} />
            <RowBlocks width={12} bp={Aegir2} />
            <RowBlocks width={12} bp={Aragath} />
        </Grid>
    ))
    .add('Ores', () => (
        <Grid container style={{width: '536px'}} spacing={8}>
            <RowIngotsOres width={12} bp={Wyvern} />
            <RowIngotsOres width={12} bp={Aegir1} />
            <RowIngotsOres width={12} bp={Aegir2} />
            <RowIngotsOres width={12} bp={Aragath} />
        </Grid>
    ))

