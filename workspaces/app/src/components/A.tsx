import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import { CONTEXT } from 'src/stores'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },
})


interface IProps extends React.ComponentProps<'a'> {
    href: string
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, theme, classes, href, onClick, ...props}) => {
    const routerStore = React.useContext(CONTEXT.ROUTER)

    const handleClick = React.useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        e.stopPropagation()
        onClick?.(e)
        routerStore.push(href)
    }, [href])

    return (
        <a href={href} onClick={handleClick} {...props}>
            {children}
        </a>
    )

})) /* ============================================================================================================= */
