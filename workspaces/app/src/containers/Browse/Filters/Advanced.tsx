import { autorun, runInAction } from 'mobx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Button, Grid, TextField } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../../common/'
import MyExpansionPanel from '../../../components/MyExpansionPanel'
import { CONTEXT } from '../../../stores'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    textField: {
        margin: 0,
    },
    monospaceBox: {
        backgroundColor: '#E8E8E8',
        fontFamily: '"Roboto Mono", Roboto',
        fontSize: '0.8rem',
        padding: '0px 0px 0px 0.5em',
        resize: 'vertical',
    },
})


interface IProps {
    expanded: boolean
    onChange(): void
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {expanded, onChange} = props
    const cardStore = React.useContext(CONTEXT.CARDS)
    const [findDirty, setFindDirty] = React.useState('')

    let dirtyOk: {} | null
    try {
        dirtyOk = JSON.parse(findDirty)
    } catch(err) {
        dirtyOk = null
    }

    React.useEffect(() => autorun(() => {
        const value = JSON.stringify(cardStore.find, null, 2)
        runInAction('reset-advanced-filter', () => setFindDirty(value))
    }))

    const handleRawFind = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = event.target.value
        setFindDirty(value)
    }

    const applyAdvancedFilter = () => {
        cardStore.setFind(JSON.parse(findDirty))
        setFindDirty(JSON.stringify(cardStore.find, null, 2))
    }

    return (
        <MyExpansionPanel title='Advanced' subtitle='' expanded={expanded} onChange={onChange}>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Button variant='contained' fullWidth>
                        Reset
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button variant='contained' fullWidth color='primary' disabled={!dirtyOk} onClick={applyAdvancedFilter}>
                        Apply
                    </Button>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        className={classes.textField}
                        id='outlined-multiline-flexible'
                        multiline
                        rows='12'
                        value={findDirty}
                        onChange={handleRawFind}
                        margin='normal'
                        helperText={helperText}
                        variant='outlined'
                        error={dirtyOk === null}
                        fullWidth
                        InputProps={{className: classes.monospaceBox}}
                    />
                </Grid>
            </Grid>
        </MyExpansionPanel>
    )
})) /* ============================================================================================================= */

const helperText = (<span>Query for ".find()". Learn more at <a href='https://docs.mongodb.com/manual/tutorial/query-documents/'>MongoDB docs</a>.</span>)
