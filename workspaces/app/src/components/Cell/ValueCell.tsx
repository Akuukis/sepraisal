import * as React from 'react'
import { hot } from 'react-hot-loader/root'
import classnames from 'classnames'

import { Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../common/'
import CenterCell, {IProps as ICenterCellProps} from './CenterCell'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    value: {
        maxWidth: '100%',
    },

    label: {
        maxWidth: '100%',
        textOverflow: 'clip',
    },
})


interface IProps extends ICenterCellProps {
    label?: string | number
    value?: string | number
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {label, value, className, ...otherProps} = props
    const labelFormatted = label !== undefined ? String(label) : '\u00A0'
    const valueFormatted = value !== undefined ? String(value) : '\u00A0'

    return (
        <CenterCell
            direction='column'
            className={classnames(classes.root, className)}
            {...otherProps}
        >
            <Typography
                className={classes.value}
                noWrap
                display='block'
                variant='subtitle2'
                component='em'
                align='center'
            >
                {valueFormatted}
            </Typography>
            <Typography
                className={classes.label}
                noWrap
                align='center'
                variant='caption'
                component='label'
                color='textSecondary'
                display='block'
            >
                {labelFormatted}
            </Typography>
        </CenterCell>
    )
})) /* ============================================================================================================= */
