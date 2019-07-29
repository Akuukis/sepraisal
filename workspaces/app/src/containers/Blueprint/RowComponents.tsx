import { IBlueprint } from '@sepraisal/common'
import { Component } from '@sepraisal/praisal'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Card, CardContent, Divider, Grid, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, formatFloat, GridSize, IMyTheme } from '../../common/'
import Table from '../../components/Table'
import { CONTEXT } from '../../stores'


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
    const PraisalManager = React.useContext(CONTEXT.PRAISAL_MANAGER)

    const data = Object.entries(props.bp.sbc.components)
        .map(([type, components]) => ({type, components}))
        .sort((a, b) => b.components - a.components)

    const getComponent = (name: string): Component => {
        const id = `Component/${name}`
        const component = PraisalManager.components.get(id)
        // tslint:disable-next-line: no-object-literal-type-assertion
        if(!component) return {} as Component

        return component
    }

    const count = data.reduce((sum, entry) => sum + entry.components, 0)
    const mass = data.reduce((sum, entry) => sum + getComponent(entry.type).mass * entry.components, 0)
    const volume = data.reduce((sum, entry) => sum + getComponent(entry.type).volume * entry.components, 0)

    return (
        <Grid item xs={props.width}>
            <Card square className={classes.card}>
                <Grid container direction='column' alignItems='stretch' style={{height: '100%', flexWrap: 'nowrap'}}>
                    <Grid item style={{flex: 'none'}}>
                        <Grid container style={{height: '100%'}}>
                            <Grid item xs={12} sm={3} className={classes.corner}>
                                <CardContent className={classes.cardContent}>
                                    <Typography variant='body1'>{`COMPONENTS`}</Typography>
                                </CardContent>
                                <Divider />
                            </Grid>
                            <Grid item xs={12} sm={3} className={classes.cell}>
                                <CardContent className={classes.cardContent}>
                                    <Typography component='span' className={classes.inline} variant='caption'>
                                        {`Components:`}
                                    </Typography>
                                    <Typography component='span' className={classes.inline} variant='body1'>
                                        {formatFloat(count)}
                                    </Typography>
                                </CardContent>
                                <Divider />
                            </Grid>
                            <Grid item xs={12} sm={3} className={classes.cell}>
                                <CardContent className={classes.cardContent}>
                                    <Typography component='span' className={classes.inline} variant='caption'>
                                        {`Weight (t):`}
                                    </Typography>
                                    <Typography component='span' className={classes.inline} variant='body1'>
                                        {formatFloat(mass / 1000)}
                                    </Typography>
                                </CardContent>
                                <Divider />
                            </Grid>
                            <Grid item xs={12} sm={3} className={classes.cell}>
                                <CardContent className={classes.cardContent}>
                                    <Typography component='span' className={classes.inline} variant='caption'>
                                        {`Vol. (m\u00B3):`}
                                    </Typography>
                                    <Typography component='span' className={classes.inline} variant='body1'>
                                        {formatFloat(volume / 1000)}
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
                            data={data}
                        />
                    </Grid>
                </Grid>
            </Card>
        </Grid>
    )
})) /* ============================================================================================================= */


const combinedTitles = {
    components: 'Components (pcs)',
    type: 'Type',
}

type ProjectionCardSbc =
    | 'components'

interface IBpProjectionRow {
    sbc: {[key in keyof Pick<IBlueprint.ISbc, ProjectionCardSbc>]: IBlueprint.ISbc[key]},
}
