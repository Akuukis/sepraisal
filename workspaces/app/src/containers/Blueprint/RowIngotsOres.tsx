import { IBlueprint } from '@sepraisal/common'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Card, CardContent, Divider, Grid, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, formatFloat, GridSize, IMyTheme } from '../../common/'
import Table from '../../components/Table'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        padding: '0.5em',
    },

    card: {
        height: `${151 * 2}px`,
    },
    cardContent: {
        paddingBottom: 8,
        paddingTop: 8,
    },
    cell: {
        // width: '268px',
    },
    corner: {
        backgroundColor: theme.palette.primary.light,
    },
    inline: {
        display: 'inline',
    },
})


interface IProps {
    bp: IBpProjectionRow
    width: GridSize
}


export default hot(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {
    const sbc = props.bp.sbc

    const combined = Object.entries(sbc.ingots)
        .map(([type, amount]) => ({type, ingots: amount, ores: sbc.ores[type]}))
        .sort((a, b) => b.ores - a.ores)

    return (
        <Grid item xs={props.width}>
            <Card square className={classes.card}>
                <Grid container direction='column' alignItems='stretch' style={{height: '100%', flexWrap: 'nowrap'}}>
                    <Grid item style={{flex: 'none'}}>
                        <Grid container style={{height: '100%'}}>
                            <Grid item xs={12} sm={3} className={classes.corner}>
                                <CardContent className={classes.cardContent}>
                                    <Typography variant='body1'>{`MATERIALS`}</Typography>
                                </CardContent>
                                <Divider />
                            </Grid>
                            <Grid item xs={12} sm={3} className={classes.cell}>
                                <CardContent className={classes.cardContent}>
                                    <Typography component='span' className={classes.inline} variant='caption'>
                                        {`Ore (m\u00B3): `}
                                    </Typography>
                                    <Typography component='span' className={classes.inline} variant='body1'>
                                        {formatFloat(combined.reduce((sum, entry) => sum + entry.ores, 0) / 1000 * 2.7)}
                                    </Typography>
                                </CardContent>
                                <Divider />
                            </Grid>
                            <Grid item xs={12} sm={3} className={classes.cell}>
                                <CardContent className={classes.cardContent}>
                                    <Typography component='span' className={classes.inline} variant='caption'>
                                        {`Ore (t): `}
                                    </Typography>
                                    <Typography component='span' className={classes.inline} variant='body1'>
                                        {formatFloat(combined.reduce((sum, entry) => sum + entry.ores, 0) / 1000)}
                                    </Typography>
                                </CardContent>
                                <Divider />
                            </Grid>
                            <Grid item xs={12} sm={3} className={classes.cell}>
                                <CardContent className={classes.cardContent}>
                                    <Typography component='span' className={classes.inline} variant='caption'>
                                        {`Ingots (t): `}
                                    </Typography>
                                    <Typography component='span' className={classes.inline} variant='body1'>
                                        {formatFloat(combined.reduce((sum, entry) => sum + entry.ingots, 0) / 1000)}
                                    </Typography>
                                </CardContent>
                                <Divider />
                            </Grid>
                            <Grid item xs={12} sm={9} className={classes.cell}/>
                        </Grid>
                    </Grid>
                    <Grid item style={{flex: '1 1 0', overflow: 'hidden'}}>
                        <Table
                            columns={Object.keys(combinedTitles)}
                            headers={combinedTitles}
                            data={combined}
                        />
                    </Grid>
                </Grid>
            </Card>
        </Grid>
    )
})) /* ============================================================================================================= */


const combinedTitles = {
    ingots: 'Ingots (kg)',
    ores: 'Ore (kg)',
    type: 'Type',
}

type ProjectionCardSbc =
    | 'ores'
    | 'ingots'

interface IBpProjectionRow {
    sbc: {[key in keyof Pick<IBlueprint.ISbc, ProjectionCardSbc>]: IBlueprint.ISbc[key]},
}
