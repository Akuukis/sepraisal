import classnames from 'classnames'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid, GridProps } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../common'
import { CONTEXT } from '../../stores'
import HeaderCell from '../Cell/HeaderCell'
import ValueCell from '../Cell/ValueCell'
import MyBox from '../MyBox'
import MyBoxColumn from '../MyBoxColumn'
import MyBoxRow from '../MyBoxRow'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        backgroundColor: theme.palette.success.light,
        borderRadius: `${theme.spacing(1)}px`,
        width: `${268 * 2}px`,
        padding: theme.spacing(0.5),
    },

    MyBoxColumn: {
    },
    MyBoxRow: {
    },
    MyBox: {
    },
    HeadingCell: {
    },
    ValueCell: {
    }
})


interface IProps extends GridProps {
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

            container
            spacing={0}
            justify='space-between'
            {...otherProps}
        >
            <CONTEXT.PARENT_COLUMNS.Provider value={12}>
                <MyBoxColumn className={classes.MyBoxColumn} width={3} {...MyBoxColumnProps}>
                    <MyBoxRow className={classes.MyBoxRow} width={3}>
                        <MyBox className={classes.MyBox} variant='header'>
                            <HeaderCell className={classes.HeadingCell} title={heading} />
                        </MyBox>
                        <MyBox>
                            <ValueCell className={classes.ValueCell} label={label} value={value} />
                        </MyBox>
                    </MyBoxRow>
                    {innerChildren}
                </MyBoxColumn>
                {children}
            </CONTEXT.PARENT_COLUMNS.Provider>
        </Grid>
    )
})) /* ============================================================================================================= */
