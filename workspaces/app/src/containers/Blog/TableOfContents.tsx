import clsx from 'clsx'
import moment from 'moment'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Card, CardContent, CardHeader, darken, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import MyLink from 'src/components/MyLink'
import { ROUTE } from 'src/constants'
import { CONTEXT } from 'src/stores'

const styles = (theme: IMyTheme) => createStyles({
    root: {
        margin: theme.spacing(1),
        [theme.breakpoints.up('sm')]: {
            margin: theme.spacing(2),
        },
        borderTopLeftRadius: theme.shape.borderRadius * 2,  // So that it doesn't anti-alise with heading.
        borderTopRightRadius: theme.shape.borderRadius * 2,  // So that it doesn't anti-alise with heading.
    },

    content: {
        '&:hover': {
            backgroundColor: theme.palette.action.hover,
        }
    },
    contentSelected: {
        backgroundColor: theme.palette.primary.light,
        '&:hover': {
            backgroundColor: darken(theme.palette.primary.light, 0.1),
        }
    },
    header: {
        backgroundColor: theme.palette.primary.dark,
    },
    heading: {
        color: theme.palette.primary.contrastText,
        borderTopLeftRadius: theme.shape.borderRadius,
        borderTopRightRadius: theme.shape.borderRadius,
    },
})


interface IProps {
    articles: IArticle[]
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {articles} = props

    const routerStore = React.useContext(CONTEXT.ROUTER)
    const selected = (new URLSearchParams(routerStore.location.search)).get('article')!

    const title = (
        <Typography className={classes.heading} variant='h2'>
            All Articles
        </Typography>
    )

    return (
        <Card className={classes.root}>
            <CardHeader className={classes.header} title={title} />
            {articles.map((article) => (
                <CardContent className={clsx(classes.content, article.id === selected && classes.contentSelected)}>
                    <MyLink variant='h3' href={`${ROUTE.BLOG}?article=${article.id}`}>
                        {article.title}
                    </MyLink>
                    <Typography>
                        {article.authors.join(', ')}, {article.date.format('MMM D, YYYY')}
                    </Typography>
                </CardContent>
            ))}
        </Card>
    )
})) /* ============================================================================================================= */

interface IArticle {
    id: string,
    title: string,
    authors: string[],
    date: moment.Moment
    link: string
}
