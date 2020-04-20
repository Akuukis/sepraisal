import { action } from 'mobx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { IconButton } from '@material-ui/core'
import IconAssessment from '@material-ui/icons/Assessment'
import IconAssessmentOutlined from '@material-ui/icons/AssessmentOutlined'

import { createSmartFC, createStyles, IMyTheme } from '../common/'
import { CONTEXT } from '../stores'


const styles = (theme: IMyTheme) => createStyles({
    root: {
        color: theme.palette.primary.main,
    },
})


interface IProps {
    id: number | string
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {id} = props
    const selectionStore = React.useContext(CONTEXT.SELECTION)

    const favorited = selectionStore.selected.includes(id)
    const handleToggle = action(`CompareButton<${JSON.stringify(id)}>`, () => {
        if(favorited) {
            selectionStore.selected.remove(id)
        } else {
            selectionStore.selected.push(id)
        }
    })

    return (
        <IconButton className={classes.root} size='small' color='inherit' aria-label='favorite' onClick={handleToggle}>
            {favorited ? <IconAssessment /> : <IconAssessmentOutlined />}
        </IconButton>
    )
})) /* ============================================================================================================= */
