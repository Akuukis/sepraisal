import clsx from 'clsx'
import moment from 'moment'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Card, CardContent, CardHeader, Typography } from '@material-ui/core'

import { ASYNC_STATE, createSmartFC, createStyles, IMyTheme } from 'src/common'
import Markdown from 'src/components/Markdown'
import { CONTEXT } from 'src/stores'

const styles = (theme: IMyTheme) => createStyles({
    root: {
        width: '100%',
    },

    header: {
    },
    content: {
    },
    hidden: {
        display: 'none',
    }
})


interface IProps {
    article: IArticle
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {article} = props

    const routerStore = React.useContext(CONTEXT.ROUTER)
    const [state, setState] = React.useState<ASYNC_STATE>(ASYNC_STATE.Idle)
    const [text, setText] = React.useState('')

    const selected = (new URLSearchParams(routerStore.location.search)).get('article')!
    const hidden = selected !== article.id

    React.useEffect(() => {
        // Fetch only when visible and not fetched yet. Short-circuit so that only the visible article gets loaded.
        if(hidden || state !== ASYNC_STATE.Idle) return

        (async () => {
            setState(ASYNC_STATE.Doing)
            console.log(article.link, 'ASYNC_STATE.Doing')
            try {
                const response = await fetch(article.link)
                const markdown = await response.text()
                setText(markdown)
                setState(ASYNC_STATE.Done)
                console.log(article.link, 'ASYNC_STATE.Done')
            } catch(err) {
                setState(ASYNC_STATE.Error)
                console.log(article.link, 'ASYNC_STATE.Error')
            }
        })()
    })

    const wrapper = (children: JSX.Element) => (
        <Card component='article' className={clsx(classes.root, hidden ? classes.hidden : undefined)}>
            <CardHeader
                className={classes.header}
                title={article.title}
                subheader={`${article.authors.join(', ')}, ${article.date.format('MMM D, YYYY')}`}
                titleTypographyProps={{component: 'h2', variant: 'h2'} as any}  // Looks like Typing bug.
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

interface IArticle {
    id: string,
    title: string,
    authors: string[],
    date: moment.Moment
    link: string
}
