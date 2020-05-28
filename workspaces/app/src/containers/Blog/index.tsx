import moment from 'moment'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import DefaultLayout from 'src/layouts/DefaultLayout'

import postFleetsLink from '../../../static/articles/fleets/fleets.md'
import postTestLink from '../../../static/articles/test/test.md'
import Article from './Article'
import TableOfContents from './TableOfContents'

const styles = (theme: IMyTheme) => createStyles({
    root: {
        margin: theme.spacing(1),
        [theme.breakpoints.up('sm')]: {
            margin: theme.spacing(2),
        },
    },

    paper: {
        padding: theme.spacing(2),
    }
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {

    return (
        <DefaultLayout className={classes.root}>
            <Grid container spacing={4} justify='center'>
                <Grid item>
                    {articles.map((article) => (
                        <Article key={article.id} article={article} />
                    ))}
                </Grid>
                <Grid item>
                    <TableOfContents articles={articles} />
                </Grid>
            </Grid>
        </DefaultLayout>
    )
})) /* ============================================================================================================= */

interface IArticle {
    id: string,
    title: string,
    authors: string[],
    date: moment.Moment
    link: string
}

const articles: IArticle[] = [
    {id: 'test', date: moment('2000-01-01'), link: postTestLink, authors: ['Test'], title: 'Test'},
    {id: 'fleets', date: moment('2019-09-09'), link: postFleetsLink, authors: ['Akuukis'], title: 'TOP Fleets of Space Engineers'},
]
