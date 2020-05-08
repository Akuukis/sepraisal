import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import Analysis from 'src/components/Analysis'

import { CONTEXT } from '../../stores'

const styles = (theme: IMyTheme) => createStyles({
    root: {
        flexWrap: 'nowrap',
    },

    column: {
        position: 'relative',
    },

    moving: {
        transition: theme.transitions.create('left', {
            easing: theme.transitions.easing.easeIn,
            duration: theme.transitions.duration.complex,
        }),
    },
    exiting: {
        transition: theme.transitions.create('opacity', {
            easing: theme.transitions.easing.easeIn,
            duration: theme.transitions.duration.complex,
        }),
        opacity: 0,
    },
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const selectionStore = React.useContext(CONTEXT.SELECTION)
    const width = selectionStore.narrow ? 0.5 : 1
    const order = [...selectionStore.selected]

    const [prevOrder, setPrevOrder] = React.useState(() => order)

    React.useEffect(() => {
        const timeout = setTimeout(() => setPrevOrder(order), theme.transitions.duration.complex * 1.2)

        return () => clearTimeout(timeout)
    })

    // Exit & Change
    const change = prevOrder
        .map((id, i) => {
            const newI = order.findIndex((innerId) => innerId === id)
            const removed = newI === -1

            const left = ((removed ? i : newI) - i) * (theme.spacing(2) + width * 2 * theme.shape.boxWidth)

            return (<Analysis
                classes={{root: clsx(classes.column, left !== 0 && classes.moving, removed && classes.exiting)}}
                style={{left}}
                key={id}
                bpId={id}
                maxWidth={width}
            />)
        })

    // Enter
    const enter = order
        .filter((id) => !prevOrder.includes(id))
        .map((id, i) => {
            return (<Analysis
                classes={{root: classes.column}}
                style={{}}
                key={id}
                bpId={id}
                maxWidth={width}
            />)
        })

    const columns = [
        ...change,
        ...enter,
    ]

    return (
        <Grid container className={classes.root}>
            {columns}
        </Grid>
    )
})) /* ============================================================================================================= */
