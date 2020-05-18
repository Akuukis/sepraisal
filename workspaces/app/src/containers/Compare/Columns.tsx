import clsx from 'clsx'
import { runInAction } from 'mobx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid, IconButton } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import Analysis from 'src/components/Analysis'
import IconClose from 'src/components/icons/IconClose'
import NothingSelected from 'src/components/NothingSelected'
import { CONTEXT } from 'src/stores'

const styles = (theme: IMyTheme) => createStyles({
    root: {
        flexWrap: 'nowrap',
    },

    rootEmpty: {
        justifyContent: 'center',
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

    const HandleDeselect = (id: number | string) => () => {
        runInAction(() => {
            selectionStore.selected.remove(id)
        })
    }

    // Exit & Change
    const change = prevOrder
        .map((id, i) => {
            const newI = order.findIndex((innerId) => innerId === id)
            const removed = newI === -1

            const left = ((removed ? i : newI) - i) * (theme.spacing(2) + width * 2 * theme.shape.boxWidth)

            return (<Analysis
                key={id}
                classes={{root: clsx(classes.column, left !== 0 && classes.moving, removed && classes.exiting)}}
                style={{left}}
                bpId={id}
                maxWidth={width}
                icons={<IconButton onClick={HandleDeselect(id)}><IconClose /></IconButton>}
            />)
        })

    // Enter
    const enter = order
        .filter((id) => !prevOrder.includes(id))
        .map((id, i) => {
            return (<Analysis
                key={id}
                classes={{root: classes.column}}
                style={{}}
                bpId={id}
                maxWidth={width}
                icons={<IconButton onClick={HandleDeselect(id)}><IconClose /></IconButton>}
            />)
        })

    const columns = [
        ...change,
        ...enter,
    ]

    return (
        <Grid container className={clsx(classes.root, columns.length === 0 && classes.rootEmpty)}>
            {columns.length > 0 ? columns : <NothingSelected />}
        </Grid>
    )
})) /* ============================================================================================================= */
