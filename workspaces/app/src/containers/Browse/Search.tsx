import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Grid, InputAdornment, TextField, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import IconBrowse from 'src/components/icons/IconBrowse'
import { CONTEXT } from 'src/stores'

import SearchSort from './SearchSort'

const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    input: {
        backgroundColor: 'white',
    },
    search: {
        maxWidth: 720,
        flexGrow: 1,
        flexShrink: 1,
    },
    status: {
        flexGrow: 0,
        flexShrink: 0,
        padding: theme.spacing(2),
        color: theme.palette.primary.contrastText,
        minWidth: 240,
    },
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const cardStore = React.useContext(CONTEXT.CARDS)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const $search = event.target.value
        cardStore.setFind({$text: {$search}})
    }

    const keyPress = async (event: React.KeyboardEvent<HTMLInputElement>) => {
        if(event.key !== 'Enter') return

        event.preventDefault()
        try {
            await cardStore.querry()
        } catch(err) {
            console.error(err)
        }
    }

    return (
        <Grid
            className={classes.root}
            item
            xs={12}

            container
            justify='center'
            alignItems='center'
        >
            <TextField
                className={classes.search}
                id='search'
                placeholder='Search by id, title, author, collection, or any keyword in description...'
                variant='outlined'
                value={cardStore.find.$text?.$search}
                onChange={handleChange}
                onKeyDown={keyPress}
                fullWidth
                InputProps={{
                    classes: {
                        root: classes.input,
                    },
                    endAdornment: [(
                        <InputAdornment position='end' id='sort'>
                            <SearchSort />
                        </InputAdornment>
                    )],
                    fullWidth: false,
                    startAdornment: (
                        <InputAdornment position='start'>
                            <IconBrowse color='primary' />
                        </InputAdornment>
                    ),
                }}
            />
            <Typography className={classes.status} variant='subtitle1' align='center'>
                {cardStore.count && `showing ${cardStore.cards.size} of ${cardStore.count} results`}
            </Typography>
        </Grid>
    )
})) /* ============================================================================================================= */
