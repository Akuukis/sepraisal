import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { useMediaQuery } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import IconBuild from 'src/components/icons/IconBuild'
import TooSmallWidth from 'src/components/TooSmallWidth'
import DefaultLayout from 'src/layouts/DefaultLayout'

import Columns from './Columns'
import Panel from './Panel'

const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const smUp = useMediaQuery(theme.breakpoints.up('sm'), { noSsr: true })

    React.useEffect(() => {
        document.title = 'Compare'
    }, [])

    return (
        <DefaultLayout
            aside={<Panel />}
            asideIcon={<IconBuild fontSize='default' />}
            asideTitle='Manage Blueprints'
            className={classes.root}
        >
            {smUp ? <Columns /> : <TooSmallWidth />}
        </DefaultLayout>
    )
})) /* ============================================================================================================= */
