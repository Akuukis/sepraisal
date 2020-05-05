import classnames from 'classnames'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid, GridProps, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../common'
import { CONTEXT } from '../../stores'
import CenterCell from '../Cell/CenterCell'
import ValueCell from '../Cell/ValueCell'
import MyBox from '../MyBox'
import MyBoxColumn from '../MyBoxColumn'
import MyBoxRow from '../MyBoxRow'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        backgroundColor: theme.palette.success.light,
        borderRadius: `${theme.spacing(1)}px`,
        width: `100%`,
        [theme.breakpoints.up('sm')]: {
            width: `${theme.shape.boxWidth * 2}px`,
        },
        padding: theme.spacing(0.5),
    },

    rootNarrow: {
        maxWidth: `${theme.shape.boxWidth}px`,
    },

    CenterCell: {
        paddingLeft: theme.spacing(3),
    },
    heading: {
        width: '100%',
        color: theme.palette.success.contrastText,
    },
    MyBoxColumn: {
    },
    MyBoxRow: {
    },
    MyBox: {
    },
    MyBoxPaper: {
        backgroundColor: theme.palette.success.main,
        boxShadow: theme.shadows[0],
    },
    HeadingCell: {
    },
    ValueCell: {
    },
    ValueCellLabel: {
        color: theme.palette.success.light,
    },
    ValueCellValue: {
        fontWeight: 500,
        color: theme.palette.success.contrastText,
    },
})


interface IProps extends GridProps {
    heading: string
    value: React.ReactNode
    label: React.ReactNode
    MyBoxColumnProps?: React.ComponentProps<typeof MyBoxColumn>
    innerChildren?: React.ReactNode
    narrow?: boolean
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {heading, value, label, MyBoxColumnProps, className, innerChildren, ...otherProps} = props

    return (
        <Grid
            className={classnames(classes.root, classes.rootNarrow, className)}
            component='section'

            item

            container
            spacing={0}
            justify='space-between'
            {...otherProps}
        >
            <CONTEXT.PARENT_COLUMNS.Provider value={{parentColumns: 12, maxWidth: 3}}>
                <MyBoxColumn className={classes.MyBoxColumn} width={3} {...MyBoxColumnProps}>
                    <MyBoxRow className={classes.MyBoxRow} width={3}>
                        <MyBox width={3} classes={{root: classes.MyBox, paper: classes.MyBoxPaper}}>
                            <CenterCell width={2} className={classes.CenterCell} {...otherProps}>
                                <Typography
                                    variant='h6'
                                    display='block'
                                    noWrap
                                    className={classes.heading}
                                >
                                    {heading}
                                </Typography>
                            </CenterCell>
                            <ValueCell
                                classes={{
                                    root: classes.ValueCell,
                                    label: classes.ValueCellLabel,
                                    value: classes.ValueCellValue,
                                }}
                                label={label}
                                value={value}
                            />
                        </MyBox>
                    </MyBoxRow>
                    {innerChildren}
                </MyBoxColumn>
                {children}
            </CONTEXT.PARENT_COLUMNS.Provider>
        </Grid>
    )
})) /* ============================================================================================================= */
