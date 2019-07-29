import { action } from 'mobx'
import { useObservable } from 'mobx-react-lite'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { createSmartFC, createStyles, IMyTheme, useAsyncEffectOnce } from '../../common/'
import { CONTEXT } from '../../stores'
import Page from './Page'
import PagesMore from './PagesMore'


const styles = (theme: IMyTheme) => createStyles({
})


interface IProps {
}


export default hot(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {
    const cardStore = React.useContext(CONTEXT.CARDS)
    const pages = useObservable([0])

    const add = async () => {
        const res = await cardStore.nextPage()
        action(() => pages.push(pages.length))

        return res
    }

    const pagesJsx = pages
        .map((_, i) => (
            <Page index={i} key={i} />
        ))

    return (<>
        {pagesJsx}
        <PagesMore add={add} />
    </>)
})) /* ============================================================================================================= */
