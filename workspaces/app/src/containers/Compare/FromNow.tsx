import clsx from 'clsx'
import moment from 'moment'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Typography, TypographyProps } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'

const styles = (theme: IMyTheme) => createStyles({
    root: {
    },
})


interface IProps extends TypographyProps {
    moment: moment.Moment
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {className, moment, ...otherProps} = props
    const [phrase, setPhrase] = React.useState<string>(moment.fromNow())

    React.useEffect(() => {
        const interval = setInterval(() => {
            const newPhrase = moment.fromNow()
            if(phrase !== newPhrase) setPhrase(newPhrase)
        }, 1000)
        return () => clearInterval(interval)
    })

    return (
        <Typography className={clsx(classes.root, className)} {...otherProps}>{phrase}</Typography>
    )
})) /* ============================================================================================================= */
