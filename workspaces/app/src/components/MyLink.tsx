import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'
import { Link as LinkRouter } from 'react-router-dom'

import { Link as LinkMaterial, LinkProps, Tooltip } from '@material-ui/core'

import { createSmartFC, createStyles, DUD_URL, IMyTheme } from 'src/common'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    router: {
        color: theme.palette.primary.dark,
        textDecoration: 'none',
        '&:hover': {
            textDecoration: 'underline',
        }
    },
    material: {
    },
    noWrap: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
})


interface IProps extends Omit<React.ComponentProps<'a'>, 'ref' | 'color'> {
    href: string
    title?: string
    variant?: LinkProps['variant']
    noWrap?: LinkProps['noWrap']
    blank?: boolean
    referrerpolicy?: string  // Should have been part of <a>?
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {blank, href, noWrap, title, variant, className, ...otherProps} = props

    let to: null | string = null

    const wrapper = (jsx: JSX.Element) => {
        if(!title) return jsx

        return (
            <Tooltip arrow placement='top' title={title}>
                {jsx}
            </Tooltip>
        )
    }

    try {
        // Error if not absolute. Also, if absolute but with matching origin, use it as relative instead (to avoid refresh).
        const url = new URL(href)
        if(url.origin === document.location.origin) to = href.slice(url.origin.length)
    } catch(err) {
        // If not absolute href then naively assume it's a relative path.
        to = href
    }

    if(to) {
        // Relateive path only. Will not refresh.
        return wrapper(
            <LinkRouter
                className={clsx(classes.root, classes.router, noWrap && classes.noWrap, className)}
                to={to}
                style={variant ? theme.typography[variant] : {}}
                {...(blank ? {target: '_blank', rel: 'noreferrer noopener'} : {})}
                {...otherProps}
            >
                {children}
            </LinkRouter>
        )
    } else {
        // Any path. Will always refresh.
        return wrapper(
            <LinkMaterial
                className={clsx(classes.root, classes.material, className)}
                variant={variant}
                noWrap={noWrap}
                href={href}
                {...(href === DUD_URL ? {} : {target: '_blank', rel: 'noreferrer noopener'})}
                {...otherProps}
            >
                {children}
            </LinkMaterial>
        )
    }

})) /* ============================================================================================================= */
