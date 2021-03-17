import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import IconFilter from 'src/components/icons/IconFilter'
import Search from 'src/components/Search'
import DefaultLayout from 'src/layouts/DefaultLayout'

import Cards from './Cards'
import Filter from './Filter'
import LoadMore from './LoadMore'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    search: {
        padding: theme.spacing(2, 0, 2, 0),
        [theme.breakpoints.up('sm')]: {
            paddingRight: theme.spacing(14),  // Give space to panel button.
        },
        maxWidth: '100%',
    },

    alert: {
        color: theme.palette.text.primary,
    }
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const [open, setOpen] = React.useState(true)

    React.useEffect(() => {
        document.title = 'Browse'
    }, [])

    return (
        <DefaultLayout
            className={classes.root}
            aside={<Filter />}
            asideIcon={<IconFilter fontSize='default' />}
            asideTitle='Filters'
            defaultOpen
        >
            <Search className={classes.search} />
            <Cards />
            <LoadMore />
        </DefaultLayout>
    )
})) /* ============================================================================================================= */
