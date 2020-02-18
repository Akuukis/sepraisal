import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../common/'
import FaqItem from './FaqItem'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        padding: '0.5em',
    },

    content: {
        padding: '0.5em',
    },
})


interface IProps {
}


export default hot(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {

    return (
        <>
            <Typography variant='h4' gutterBottom>Questions & Answers</Typography>
            <FaqItem title='How much blueprints does SE-Praisal have?'>
                <Typography paragraph>
                    SE-Praisal has 92,000 blueprints and growing (updated Jan 20, 2020), minus few hundred with errors -
                        missing or corrupt blueprint inside workshop file,
                        enourmous blueprint filesize (10MB+),
                        and misc technical problems.
                </Typography>
            </FaqItem>
            <FaqItem title='Does SE-Praisal has all blueprints?'>
                <Typography paragraph>
                    TL;DR: Yes, sort of.
                </Typography>
                <Typography paragraph>
                    At the time of writing, Steam shows that there are 150,000+ blueprints at Space Engineers workshop.
                    Although it most likely is true, there's a problem.
                    When browsing workshop, e.g. click "next page" again and again, at page 1670 or so there's an end.
                    Really, try it.
                    Furthermore, not every page 30-blueprint page has 30 blueprints - sometimes as little as 26.
                    Also, some blueprints make it on two pages - at the end of one and at the start of next one.
                    On the good note, steam workshop can be browsed both by "newest" and "most popular", although much of it overlaps.
                </Typography>
                <Typography paragraph>
                    So out of 150,000+ blueprints,
                        in theory it gives upper limit of 100,200 (=16700*30*2) blueprints,
                        but in practice that's around 70,000 browse-able blueprints.
                </Typography>
            </FaqItem>
        </>
    )
})) /* ============================================================================================================= */
