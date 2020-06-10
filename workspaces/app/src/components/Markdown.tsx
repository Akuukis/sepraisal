import clsx from 'clsx'
import { dirname } from 'path'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'
import ReactMarkdown from 'react-markdown'

import { Divider, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import { CONTEXT } from 'src/stores'

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
        padding: theme.spacing(1.5, 2),
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
    fullWidthContainer: {
        display: 'block',
        width: `calc(100% + ${12 * 4 * 2}px)`,  // Equals padding on the blog card.
        margin: theme.spacing(0, -12),
        overflowX: 'auto',
    },
    fullWidth: {
        display: 'block',
        margin: `0px auto`,
        width: '100%',
        maxWidth: 'max-content',
    },
    imgFullWidthCaption: {
        margin: theme.spacing(2, 8),
    },
    imgInline: {
        height: '24px',
        verticalAlign: 'text-bottom',
    },
    blockquote: {
        color: theme.palette.text.secondary,
        margin: theme.spacing(2, 0),
        padding: theme.spacing(0, 8),
        borderLeft: `${theme.spacing(1)}px solid ${theme.palette.primary.light}`,
    },
})


interface IProps extends Omit<React.ComponentProps<typeof ReactMarkdown>, 'source'> {
    skipH2?: boolean
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {location} = React.useContext(CONTEXT.ROUTER)
    const {skipH2, className} = props

    return (
        <ReactMarkdown
            renderers={{
                root: ({children}) => className ? (<Paper className={clsx(classes.root, className)}>{children}</Paper>) : children,
                heading: ({children, level}) => skipH2 && level === 2 ? null : (<Typography variant={`h${level}` as 'h1'}>{children}</Typography>),
                paragraph: ({children}) => (<Typography paragraph>{children}</Typography>),
                // text,
                // break,
                // emphasis,
                // strong,
                // delete,
                link: ({children, href, title}) => <MyLink href={href} title={title}>{children}</MyLink>,
                linkReference: ({children, href, title}) => <MyLink href={href} title={title}>{children}</MyLink>,
                list: ({children, tight, ordered, start, depth}) => (
                    <Typography gutterBottom paragraph={!tight} component={ordered ? 'ol' : 'ul'}>{children}</Typography>
                ),
                // listItem,
                table: ({children, columnAlignment}) => (
                    <div className={classes.fullWidthContainer}>
                        <Table className={clsx(classes.fullWidth, classes.table)}>{children}</Table>,
                    </div>
                ),
                tableHead: ({children, columnAlignment}) => <TableHead className={classes.tableHead}>{children}</TableHead>,
                tableBody: ({children, columnAlignment}) => <TableBody>{children}</TableBody>,
                tableRow: ({children, columnAlignment, isHeader}) => <TableRow className={classes.tableRow}>{children}</TableRow>,
                tableCell: ({children, align, isHeader}) => (
                    <TableCell className={clsx(classes.tableCell, isHeader && classes.tableCellHeading)} align={align || 'left'}>{children}</TableCell>
                ),
                inlineCode: ({children, inline, value}) => <code className={classes.code}>{value}</code>,
                code: ({language, value}) => <pre className={classes.pre}>{value}</pre>,
                thematicBreak: () => <Divider className={classes.divider} />,
                image: ({src, alt, title}) => (
                    <div className={classes.fullWidthContainer}>
                        <img className={classes.fullWidth} alt={alt} src={`${src}`} />
                        <Typography className={classes.imgFullWidthCaption} variant='caption'>
                            {title ?? ''}
                            &nbsp;(<MyLink blank href={`${dirname(location.pathname)}${src}`}>full size image</MyLink>)
                        </Typography>
                    </div>
                ),
                imageReference: ({src, alt, title}) => <img className={classes.imgInline} alt={alt} src={`${src}`} />,
                blockquote: ({children}) => <blockquote className={classes.blockquote}>{children}</blockquote>,

                //// ABOVE: Done & for others defaults looks ok.
                //// BELOW: TODO: Looks bad. This will be useful: `(props) => console.log(props) || null`
                // definition,

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
