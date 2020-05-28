import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme, useAsyncEffectOnce } from 'src/common'
import Markdown from 'src/components/Markdown'
import DefaultLayout from 'src/layouts/DefaultLayout'

import postLink from '../../../static/test.md'

const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    paper: {
        padding: theme.spacing(2),
    }
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const [text, setText] = React.useState('')

    useAsyncEffectOnce(async () => {
        const response = await fetch(postLink)
        const markdown = await response.text()
        setText(markdown)
    })

    return (
        <DefaultLayout className={classes.root}>
            <Grid container spacing={2} justify='center'>
                <Grid item>
                    <Markdown>
                        {text}
                    </Markdown>
                </Grid>
            </Grid>
        </DefaultLayout>
    )
})) /* ============================================================================================================= */
