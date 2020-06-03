import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Card, CardContent, CardHeader, Typography } from '@material-ui/core'

import { ASYNC_STATE, createSmartFC, createStyles, IBlogArticle, IMyTheme } from 'src/common'
import Markdown from 'src/components/Markdown'
import { ROUTE } from 'src/constants'
import { CONTEXT } from 'src/stores'

const styles = (theme: IMyTheme) => createStyles({
    root: {
        width: '100%',
    },

    header: {
        padding: theme.spacing(8, 8, 0, 8),
    },
    content: {
        padding: theme.spacing(8),
        '&:last-child': {
            paddingBottom: theme.spacing(12),
        }
    },
    hidden: {
        display: 'none',
    }
})


interface IProps {
    article: IBlogArticle
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {article} = props

    const routerStore = React.useContext(CONTEXT.ROUTER)
    const [state, setState] = React.useState<ASYNC_STATE>(ASYNC_STATE.Idle)
    const [text, setText] = React.useState('')

    const selected = routerStore.location.pathname.slice(ROUTE.BLOG.length + 1)
    const hidden = selected !== article.id

    React.useEffect(() => {
        // Fetch only when visible and not fetched yet. Short-circuit so that only the visible article gets loaded.
        if(hidden || state !== ASYNC_STATE.Idle) return

        (async () => {
            setState(ASYNC_STATE.Doing)
            try {
                const response = await fetch(article.link)
                const markdown = await response.text()
                setText(markdown)
                setState(ASYNC_STATE.Done)
            } catch(err) {
                setState(ASYNC_STATE.Error)
            }
        })()
    })

    const wrapper = (children: JSX.Element) => (
        <Card component='article' className={clsx(classes.root, hidden ? classes.hidden : undefined)}>
            <CardHeader
                className={classes.header}
                title={article.title}
                subheader={`${article.date.format('MMM D, YYYY')} (by ${article.authors.join(', ')})`}
                titleTypographyProps={{component: 'h2', variant: 'h2', align: 'left', gutterBottom: true} as any}  // Looks like Typing bug.
            />
            <CardContent component='main' className={classes.content}>
                {children}
            </CardContent>
        </Card>
    )

    switch(state) {
        case(ASYNC_STATE.Idle): {
            return null
        }
        case(ASYNC_STATE.Doing): {
            return wrapper(
                <Markdown skipH2>
                    {'*Loading*'}
                </Markdown>
            )
        }
        case(ASYNC_STATE.Done): {
            return wrapper(
                <Markdown skipH2>
                    {text}
                </Markdown>
            )
        }
        case(ASYNC_STATE.Error): {
            return hidden ? null : wrapper(
                <Typography color='error'>
                    Something went wrong
                </Typography>
            )
        }
        default: throw new Error('catch me')
    }

})) /* ============================================================================================================= */
