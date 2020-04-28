import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { createStyles, Grid, GridProps, List, Switch, Typography } from '@material-ui/core'

import { createSmartFC, IMyTheme } from '../../common'
import { CONTEXT } from '../../stores'
import PanelSelectedRow from './PanelSelectedRow'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        padding: theme.spacing(0, 6),
        minHeight: theme.spacing(12),
    },

    details: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingBottom: 0,
        flexDirection: 'column',
    },
    heading: {
        flexBasis: `calc((100% - 36px) / 3)`,
        maxWidth: `calc((100% - 36px) / 3)`,
        flexShrink: 0,
        fontSize: theme.typography.pxToRem(16),
        ...theme.typography.h6,
    },
    secondaryHeading: {
        fontWeight: 500,
        color: theme.palette.primary.main,
    },

    list: {
        padding: 0,
    }
})


interface IProps extends Omit<GridProps, 'title'> {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const { ...otherProps } = props
    const blueprintStore = React.useContext(CONTEXT.BLUEPRINTS)
    const selectionStore = React.useContext(CONTEXT.SELECTION)

    return (
        <div>
            <Grid container className={classes.root} alignItems='center' { ...otherProps }>
                <Typography className={classes.heading} variant='h3'>Selected</Typography>
                <Grid item style={{flexGrow: 1}}>
                    <Typography component='span' className={classes.secondaryHeading} variant='body1'>
                        {selectionStore.selected.length}
                    </Typography>
                </Grid>
                <Grid item>
                    <Switch />
                    <Typography component='span' variant='subtitle2'>narrow columns</Typography>
                </Grid>
            </Grid>
            <List dense className={classes.list}>
                {[...selectionStore.selected].map<JSX.Element>((id, index) => (
                    <PanelSelectedRow
                        key={index}
                        id={id}
                        title={blueprintStore.getSomething(id).steam!.title}
                    />
                ))}
            </List>
        </div>
    )
})) /* ============================================================================================================= */
