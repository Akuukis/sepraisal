import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Button, Grid } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import { QueryFindBuilder } from 'src/models'
import { CONTEXT } from 'src/stores'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        width: '100%',
    },

    button: {
        color: theme.palette.text.secondary,
        margin: theme.spacing(-1.5, 0),  // Counter button padding, because it already has enough outer margin.
    },
})

interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const formGroupScope = React.useContext(CONTEXT.FORM_GROUP_SCOPE)
    const cardStore = React.useContext(CONTEXT.CARDS)

    const actives = [...formGroupScope.entries()]
        .filter(([id, value]) => value !== false)
        .filter(([id, value]) => value === true || cardStore.querryFindBuilder.getCriterion(QueryFindBuilder.parseId(id)))
        .map(([id]) => id)

    const handleClear = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        event.stopPropagation()  // Don't open the drawer.
        for(const active of actives) cardStore.querryFindBuilder.setCriterion(active, null)
    }

    if(!actives.length) return (<>{''}</>)

    return (
        <Grid container justify='space-between' alignItems='baseline' className={classes.root}>
            {`${actives.length} filters active`}
            &nbsp;
            <Button className={classes.button} onClick={handleClear}>clear</Button>
        </Grid>
    )
})) /* ============================================================================================================= */
