import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'
import ReactMarkdown from 'react-markdown'

import { Divider, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'

import MyLink from './MyLink'

const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    code: {
        ...theme.typography.mono,
        padding: theme.spacing(0.25, 1),
        backgroundColor: theme.palette.background.default,
        borderRadius: theme.shape.borderRadius,
    },
    pre: {
        ...theme.typography.mono,
        padding: theme.spacing(2, 2),
        backgroundColor: theme.palette.background.default,
        borderRadius: theme.shape.borderRadius,
        overflow: 'auto',
    },
    table: {
        margin: theme.spacing(4, 0),
    },
    tableHead: {
        '& > tr': {
            backgroundColor: `${theme.palette.background.paper} !important`,
        },
        borderBottom: `2px solid ${theme.palette.text.secondary}`,
        // boxShadow: theme.shadows[1],
        // filter: dropShadowFromBoxShadow(theme.shadows[1]),
    },
    tableRow: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.action.hover,
        },
    },
    tableCell: {
        ...theme.typography.body2,
    },
    tableCellHeading: {
        ...theme.typography.subtitle1,
    },
    divider: {
        backgroundColor: theme.palette.primary.light,
        display: 'inherit !important',
        height: 2,
        margin: theme.spacing(8, 0),
    },
})


interface IProps extends Omit<React.ComponentProps<typeof ReactMarkdown>, 'source'> {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {className} = props

    return (
        <ReactMarkdown
            renderers={{
                root: ({children}) => (<Paper className={clsx(classes.root, className)}>{children}</Paper>),
                heading: ({children, level}) => (<Typography variant={`h${level}` as 'h1'}>{children}</Typography>),
                paragraph: ({children}) => (<Typography paragraph>{children}</Typography>),
                // text,
                // break,
                // emphasis,
                // strong,
                // delete,
                link: ({children, href, title}) => <MyLink href={href} title={title}>{children}</MyLink>,
                linkReference: ({children, href, title}) => <MyLink href={href} title={title}>{children}</MyLink>,
                list: ({children, tight, ordered, start, depth}) => (
                    <Typography paragraph={!tight} component={ordered ? 'ol' : 'ul'}>{children}</Typography>
                ),
                // listItem,
                table: ({children, columnAlignment}) => <Table className={classes.table}>{children}</Table>,
                tableHead: ({children, columnAlignment}) => <TableHead className={classes.tableHead}>{children}</TableHead>,
                tableBody: ({children, columnAlignment}) => <TableBody>{children}</TableBody>,
                tableRow: ({children, columnAlignment, isHeader}) => <TableRow className={classes.tableRow}>{children}</TableRow>,
                tableCell: ({children, align, isHeader}) => (
                    <TableCell className={isHeader ? classes.tableCellHeading : classes.tableCell} align={align || 'left'}>{children}</TableCell>
                ),
                inlineCode: ({children, inline, value}) => <code className={classes.code}>{value}</code>,
                code: ({language, value}) => <pre className={classes.pre}>{value}</pre>,
                thematicBreak: () => <Divider className={classes.divider} />,

                //// ABOVE: Done & for others defaults looks ok.
                //// BELOW: TODO: Looks bad. This will be useful: `(props) => console.log(props) || null`
                // image,
                // imageReference,
                // definition,
                // blockquote,

                //// Not implemented.
                html: () => {throw new Error('Not implemented.')},
                virtualHtml: () => {throw new Error('Not implemented.')},
                parsedHtml: () => {throw new Error('Not implemented.')},
            }}
        >
            {children}
        </ReactMarkdown>
    )
})) /* ============================================================================================================= */
