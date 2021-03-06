import classnames from 'classnames'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid, GridProps, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import { CONTEXT } from 'src/stores'

import CenterCell from '../Cell/CenterCell'
import ValueCell from '../Cell/ValueCell'
import MyBox from '../MyBox'
import MyBoxColumn from '../MyBoxColumn'
import MyBoxRow from '../MyBoxRow'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        padding: theme.spacing(1, 0),
        width: `${theme.shape.boxWidth * 2}px`,
    },

    inner: {
        borderRadius: `${theme.spacing(1)}px`,
        backgroundColor: theme.palette.success.light,
        padding: theme.spacing(0.5),
    },
    CenterCell: {
        paddingLeft: theme.spacing(3),
    },
    heading: {
        width: '100%',
        color: theme.palette.success.contrastText,
        textTransform: 'uppercase',
    },
    MyBoxColumn: {
    },
    MyBoxRow: {
    },
    MyBox: {
    },
    MyBoxPaper: {
        backgroundColor: theme.palette.success.dark,
        boxShadow: theme.shadows[0],
    },
    HeadingCell: {
    },
    ValueCell: {
    },
    ValueCellLabel: {
        color: theme.palette.success.contrastText,
    },
    ValueCellValue: {
        color: theme.palette.success.contrastText,
        fontWeight: 700,
    },
})


interface IProps extends Omit<GridProps, 'classes'> {
    heading: string
    value: React.ReactNode
    label: React.ReactNode
    MyBoxColumnProps?: React.ComponentProps<typeof MyBoxColumn>
    innerChildren?: React.ReactNode
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {heading, value, label, MyBoxColumnProps, className, innerChildren, ...otherProps} = props

    return (
        <Grid
            className={classnames(classes.root, className)}
            component='section'

            item
            {...otherProps}
        >
            <Grid
                className={classes.inner}
                container
                spacing={0}
                justify='space-between'
            >
                <CONTEXT.PARENT_COLUMNS.Provider value={{parentColumns: 12, maxWidth: 6}}>
                    <MyBoxColumn className={classes.MyBoxColumn} width={3} {...MyBoxColumnProps}>
                        <MyBoxRow className={classes.MyBoxRow} width={3}>
                            <MyBox width={3} classes={{root: classes.MyBox, paper: classes.MyBoxPaper}}>
                                <CenterCell width={2} className={classes.CenterCell} {...otherProps}>
                                    <Typography
                                        variant='h4'
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
        </Grid>
    )
})) /* ============================================================================================================= */
