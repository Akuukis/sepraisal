import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import { ROUTE } from 'src/constants'
import DefaultLayout from 'src/layouts/DefaultLayout'
import { CONTEXT } from 'src/stores'

import Article from './Article'
import { articles, published } from './articles'
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
        routerStore.goLocation({pathname: `${ROUTE.BLOG}/${published[0].id}`})
    }
    const selected = routerStore.location.pathname.slice(ROUTE.BLOG.length + 1)

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
