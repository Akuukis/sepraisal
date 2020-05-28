import clsx from 'clsx'
import moment from 'moment'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Typography } from '@material-ui/core'

import { ASYNC_STATE, createSmartFC, createStyles, IMyTheme } from 'src/common'
import Markdown from 'src/components/Markdown'
import { CONTEXT } from 'src/stores'

const styles = (theme: IMyTheme) => createStyles({
    root: {
        width: '100%',
        boxSizing: 'border-box',
        padding: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            padding: theme.spacing(4),
        },
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

    switch(state) {
        case(ASYNC_STATE.Idle): {
            return null
        }
        case(ASYNC_STATE.Doing): {
            return (
                <Markdown className={clsx(classes.root, hidden ? classes.hidden : undefined)}>
                    {'*Loading*'}
                </Markdown>
            )
        }
        case(ASYNC_STATE.Done): {
            return (
                <Markdown className={clsx(classes.root, hidden ? classes.hidden : undefined)}>
                    {text}
                </Markdown>
            )
        }
        case(ASYNC_STATE.Error): {
            return hidden ? null : (
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
