import { autorun, runInAction } from 'mobx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import {
    Button,
    ExpansionPanel,
    ExpansionPanelDetails,
    ExpansionPanelSummary,
    TextField,
    Typography,
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

import { createSmartFC, createStyles, IMyTheme } from '../../../common/'
import { CONTEXT } from '../../../stores'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    content: {
    },
    heading: {
        flexBasis: '33.33%',
        flexShrink: 0,
        fontSize: theme.typography.pxToRem(15),
    },
    monospaceBox: {
        backgroundColor: '#E8E8E8',
        fontFamily: '"Roboto Mono", Roboto',
        fontSize: '0.8rem',
        padding: '0px 0px 0px 0.5em',
        resize: 'vertical',
    },
    secondaryHeading: {
        color: theme.palette.text.secondary,
        fontSize: theme.typography.pxToRem(15),
    },
})


interface IProps {
    expanded: boolean
    onChange(): void
}


export default hot(createSmartFC(styles)<IProps>(({children, classes, theme, ...props}) => {
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
        <ExpansionPanel className={classes.root} expanded={expanded} onChange={onChange}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                <Typography className={classes.heading}>Advanced</Typography>
                <Typography className={classes.secondaryHeading}/>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails className={classes.content}>
                <Button variant='contained' fullWidth>
                    Reset
                </Button>
                <Button variant='contained' fullWidth color='primary' disabled={!dirtyOk} onClick={applyAdvancedFilter}>
                    Apply
                </Button>
            </ExpansionPanelDetails>
            <ExpansionPanelDetails className={classes.content}>
                <TextField
                    id='outlined-multiline-flexible'
                    multiline
                    rows='12'
                    value={findDirty}
                    onChange={handleRawFind}
                    margin='normal'
                    helperText={<span>Query for ".find()". Learn more at <a href='https://docs.mongodb.com/manual/tutorial/query-documents/'>MongoDB docs</a>.</span>}
                    variant='outlined'
                    error={dirtyOk === null}
                    fullWidth
                    InputProps={{className: classes.monospaceBox}}
                />
            </ExpansionPanelDetails>
        </ExpansionPanel>
    )
})) /* ============================================================================================================= */
