import * as React from 'react'
import { cold } from 'react-hot-loader'
import { ReactSortable } from 'react-sortablejs'

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
    },
    list: {
        padding: 0,
    },
    handle: {
        minWidth: 24 + theme.spacing(2),
    },
})


interface IProps extends Omit<GridProps, 'title'> {
}


export default cold(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
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
                <ReactSortable
                    handle={`.${classes.handle}`}
                    animation={theme.transitions.duration.standard}
                    list={selectionStore.selectedItems}
                    setList={selectionStore.setSelectedItems}
                >
                    {selectionStore.selectedItems.map(({id, name}) => (
                        <PanelSelectedRow
                            classes={{handle: classes.handle}}
                            id={id}
                            title={blueprintStore.getSomething(id).steam!.title}
                        />
                    ))}
                </ReactSortable>
            </List>
        </div>
    )
})) /* ============================================================================================================= */
