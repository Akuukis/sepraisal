import { IBlueprint } from '@sepraisal/common'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Card, CardContent, Divider, Grid, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, formatDecimal, GridSize, IMyTheme } from '../../common/'
import Table from '../../components/Table'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        padding: '0.5em',
    },

    card: {
        height: `${151 * 4}px`,
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

    const blocks = (Object.entries(sbc.blocks))
        // .filter(([block, count]) => {
        //     if(!block.includes('/*')) return true

        //     other = other + count
        // })
        .map(([block, count]) => ({block, count}))
        // .concat([{block: '(armor, LCDs, lights, etc.)', count: other}])

    return (
        <Grid item xs={props.width}>
            <Card square className={classes.card}>
                <Grid container direction='column' alignItems='stretch' style={{height: '100%', flexWrap: 'nowrap'}}>
                    <Grid item style={{flex: 'none'}}>
                        <Grid container style={{height: '100%'}}>
                            <Grid item xs={12} sm={3} className={classes.corner}>
                                <CardContent className={classes.cardContent}>
                                    <Typography variant='body1'>{`BLOCK LIST`}</Typography>
                                </CardContent>
                                <Divider />
                            </Grid>
                            <Grid item xs={12} sm={3} className={classes.cell}>
                                <CardContent className={classes.cardContent}>
                                    <Typography component='span' className={classes.inline} variant='caption'>
                                        {`Blocks: `}
                                    </Typography>
                                    <Typography component='span' className={classes.inline} variant='body1'>
                                        {formatDecimal(blocks.reduce((sum, block) => sum + block.count, 0))}
                                    </Typography>
                                </CardContent>
                                <Divider />
                            </Grid>
                            <Grid item xs={12} sm={9} className={classes.cell}>
                                {/* TODO */}
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item style={{flex: '1 1 0', overflow: 'hidden'}}>
                        <Table
                            columns={Object.keys(datumTitles)}
                            headers={datumTitles}
                            data={blocks}
                        />
                    </Grid>
                </Grid>
            </Card>
        </Grid>
    )
})) /* ============================================================================================================= */


const datumTitles = {
    block: 'Block ID',
    count: 'Count',
}

type ProjectionCardSbc =
    | 'blocks'

interface IBpProjectionRow {
    sbc: {[key in keyof Pick<IBlueprint.ISbc, ProjectionCardSbc>]: IBlueprint.ISbc[key]},
}
