import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../common'


interface IProps {
}


const styles = (theme: IMyTheme) => createStyles({
    root: {
        background: 'rgba(0,0,0,0.4)',
        bottom: 0,
        left: 0,
        margin: '-0.5em -0.5em 0em -0.5em',
        padding: '2.5em',
        position: 'absolute',
        right: 0,
        top: 0,
    },
})


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    return (
        <div className={classes.root}>
            <Typography variant='h3' style={{color: '#fff'}} align='center'>Drop files...</Typography>
        </div>
    )
})) /* ============================================================================================================= */
