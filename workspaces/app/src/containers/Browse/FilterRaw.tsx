import { autorun } from 'mobx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Button, Grid, TextField, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import MyExpansionPanel from 'src/components/MyExpansionPanel'
import MyLink from 'src/components/MyLink'
import { CONTEXT } from 'src/stores'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    textField: {
        margin: 0,
    },
    monospaceBox: {
        ...theme.typography.mono,
        backgroundColor: theme.palette.background.default,
        padding: '0px 0px 0px 0.5em',
        resize: 'vertical',
    },
    helperText: {
        padding: theme.spacing(1),
    },
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const cardStore = React.useContext(CONTEXT.CARDS)
    const analyticsStore = React.useContext(CONTEXT.ANALYTICS)
    const [dirty, setDirty] = React.useState(JSON.stringify(cardStore.find, null, 2))

    let dirtyOk: Record<string, unknown> | null
    try {
        dirtyOk = JSON.parse(dirty)
    } catch(err) {
        dirtyOk = null
    }

    const reset = () => setDirty(JSON.stringify(cardStore.find, null, 2))
    React.useEffect(() => autorun(reset, {name: `${__filename}: autorun(reset)`}), [])


    const handleRawFind = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const value = event.target.value
        setDirty(value)
    }

    const applyAdvancedFilter = () => {
        analyticsStore.trackEvent('customFilter', 'advanced')
        cardStore.querryFindBuilder.replaceFilter(JSON.parse(dirty))
        reset()
    }

    const totalCriteria = (cardStore.querryFindBuilder.find.$and?.length ?? 2) - 2

    return (
        <MyExpansionPanel header='Advanced' subheader={totalCriteria ? `${totalCriteria} criteria from filters` : ``}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        className={classes.textField}
                        id='outlined-multiline-flexible'
                        multiline
                        rows='12'
                        value={dirty}
                        onChange={handleRawFind}
                        margin='normal'
                        variant='outlined'
                        error={dirtyOk === null}
                        fullWidth
                        InputProps={{className: classes.monospaceBox}}
                    />
                </Grid>
                <Grid item xs={6}>
                    <Button variant='contained' fullWidth onClick={reset}>
                        Reset
                    </Button>
                </Grid>
                <Grid item xs={6}>
                    <Button variant='contained' fullWidth color='primary' disabled={!dirtyOk} onClick={applyAdvancedFilter}>
                        Apply
                    </Button>
                </Grid>
                <Typography variant='caption' className={classes.helperText}>
                    {helperText}
                </Typography>
            </Grid>
        </MyExpansionPanel>
    )
})) /* ============================================================================================================= */

const helperText = (<span>Query for ".find()". Learn more at <MyLink href='https://docs.mongodb.com/manual/tutorial/query-documents/'>MongoDB docs</MyLink>.</span>)
