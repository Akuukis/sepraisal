import clsx from 'clsx'
import moment from 'moment'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid } from '@material-ui/core'

import { createSmartFC, createStyles, IBlogArticle, IMyTheme } from 'src/common'
import { ROUTE } from 'src/constants'
import DefaultLayout from 'src/layouts/DefaultLayout'
import { CONTEXT } from 'src/stores'

import postClassificationLink from '../../../static/articles/classification/classification.md'
import postFleetsDIYLink from '../../../static/articles/fleets/fleets-how.md'
import postFleetsTableLink from '../../../static/articles/fleets/fleets.md'
import postLaunch2Link from '../../../static/articles/launch2/launch2.md'
import lookingForNewServersLink from '../../../static/articles/looking-for-new-servers/looking-for-new-servers.md'
import postTestLink from '../../../static/articles/test/test.md'
import Article from './Article'
import TableOfContents from './TableOfContents'

const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    article: {
        maxWidth: '816px',  // -16px
        minWidth: '300px',
        flexBasis: '400px',
        flexShrink: 1,
        flexGrow: 100,
        [theme.breakpoints.up('sm')]: {
            minWidth: '384px',
            flexBasis: '384px',
        },
    },
    articleWide: {
        maxWidth: 'unset',
    },
    toc: {
        flexBasis: '200px',
        flexShrink: 100,
        flexGrow: 1,
        [theme.breakpoints.up('sm')]: {
            maxWidth: '400px',
        },
    },
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const routerStore = React.useContext(CONTEXT.ROUTER)
    const selectedArticleId = routerStore.location.pathname.slice(ROUTE.BLOG.length + 1)

    const article = articles.find((article) => article.id === selectedArticleId)
    if(!article) {
        routerStore.push(`${ROUTE.BLOG}/${published[0].id}`)
    }
    const selected = routerStore.location.pathname.slice(ROUTE.BLOG.length + 1)
    console.log(selected)
    React.useEffect(() => {
        document.title = `Blog - ${article?.title ? article.title : published[0].title}`
    })

    return (
        <DefaultLayout className={classes.root}>
            <Grid container spacing={4} justify='center' direction='row-reverse'>
                <Grid className={classes.toc} item>
                    <TableOfContents articles={published} />
                </Grid>
                <Grid className={clsx({[classes.article]: true, [classes.articleWide]: selected === 'fleets'})} item xs>
                    {articles.map((article) => (
                        <Article key={article.id} article={article} />
                    ))}
                </Grid>
            </Grid>
        </DefaultLayout>
    )
})) /* ============================================================================================================= */

const published: IBlogArticle[] = [
    {id: 'looking-for-new-host', date: moment('2020-10-24'), link: lookingForNewServersLink, authors: ['Akuukis'], title: 'Sad story: Looking for new servers'},
    {id: 'fleets', date: moment('2020-06-10'), link: postFleetsTableLink, authors: ['Akuukis'], title: 'Fleet Rankings v2'},
    {id: 'fleets-how', date: moment('2020-06-10'), link: postFleetsDIYLink, authors: ['Akuukis'], title: `Fleet Rankings v2: How it's made`},
    {id: 'launch2', date: moment('2020-06-03'), link: postLaunch2Link, authors: ['Akuukis'], title: 'SE Praisal V2 launched!'},
]

const hidden: IBlogArticle[] = [
    {id: 'classification', date: moment('2020-06-10'), link: postClassificationLink, authors: ['Akuukis'], title: 'Ship Classification'},
    {id: 'test', date: moment('2000-01-01'), link: postTestLink, authors: ['Test'], title: 'Test'},
]

const articles = [...published, ...hidden]
