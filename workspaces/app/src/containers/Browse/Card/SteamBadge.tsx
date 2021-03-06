import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { darken, IconButton } from '@material-ui/core'

import { createSmartFC, createStyles, formatDecimal, IMyTheme, linkBpProps, STEAM_COLORS } from 'src/common'
import IconSteam from 'src/components/icons/IconSteam'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        minWidth: '0px',  // Shrink if name too long.
        padding: theme.spacing(0, 1),
        backgroundColor: STEAM_COLORS.blue,
        borderRadius: theme.shape.borderRadius,
        '&:hover': {
            backgroundColor: darken(STEAM_COLORS.blue, 0.2),
        }
    },

    label: {
        color: STEAM_COLORS.white,
        ...theme.typography.caption,
    },
    icon: {
        ...theme.typography.body2,
        paddingRight: theme.spacing(0.5),
    },
})


interface IProps {
    id: number
    amount: number
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {id, amount} = props

    return (
        <IconButton
            classes={{
                root: classes.root,
                label: classes.label,
            }}
            {...linkBpProps(id)}
        >
            <IconSteam className={classes.icon} />
            {formatDecimal(amount)}
        </IconButton>
    )
})) /* ============================================================================================================= */
