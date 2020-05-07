import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { useMediaQuery } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../common'
import MyBoxColumn from '../MyBoxColumn'
import MySectionNarrow from './MySectionNarrow'
import MySectionWide from './MySectionWide'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },
    inner: {
    },

    rootNarrow: {
    },

    CenterCell: {
    },
    heading: {
    },
    MyBoxColumn: {
    },
    MyBoxRow: {
    },
    MyBox: {
    },
    MyBoxPaper: {
    },
    HeadingCell: {
    },
    ValueCell: {
    },
    ValueCellLabel: {
    },
    ValueCellValue: {
    },
})

type MySectionProps = React.ComponentProps<typeof MySectionWide> & React.ComponentProps<typeof MySectionNarrow>
interface IProps extends MySectionProps {
    heading: string
    value: React.ReactNode
    label: React.ReactNode
    MyBoxColumnProps?: React.ComponentProps<typeof MyBoxColumn>
    innerChildren?: React.ReactNode
    narrow?: boolean
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {className, narrow, ...otherProps} = props
    const largerThanSm = useMediaQuery(theme.breakpoints.up('sm'))

    return (largerThanSm && !narrow) ?
            <MySectionWide className={clsx(classes.root, className)} classes={classes} {...otherProps as React.ComponentProps<typeof MySectionWide>}>
                {children}
            </MySectionWide>
        :
            <MySectionNarrow className={clsx(classes.root, className)} classes={classes} {...otherProps as React.ComponentProps<typeof MySectionNarrow>}>
                {children}
            </MySectionNarrow>

})) /* ============================================================================================================= */
