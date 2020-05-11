import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Card, CardContent, CardHeader, CardProps, Chip, TextField } from '@material-ui/core'
import { Autocomplete } from '@material-ui/lab'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import IconBrowse from 'src/components/icons/IconBrowse'
import { CONTEXT } from 'src/stores'



const styles = (theme: IMyTheme) => createStyles({
    root: {
        borderStyle: `solid`,
        borderWidth: 1,
        borderColor: theme.palette.text.secondary,
    },

    content: {
        padding: theme.spacing(1, 2),
        textAlign: 'right',
        '&:last-child': {
            paddingBottom: theme.spacing(4),
        }
    },
    header: {
        borderBottomStyle: `solid`,
        borderBottomWidth: 1,
        borderBottomColor: theme.palette.text.secondary,
        padding: theme.spacing(2),
        backgroundColor: theme.palette.background.default,
    },
    title: {
        ...theme.typography.subtitle2,
    },
    icon: {
        verticalAlign: 'text-bottom',
    },
    textField: {
    },
    input: {
        backgroundColor: theme.palette.background.paper,
    },
    chip: {
        margin: theme.spacing(0.5),
        backgroundColor: theme.palette.background.paper,
    }
})

interface IProps extends CardProps {
    heading: string
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {heading, className, ...otherProps} = props
    const praisalManager = React.useContext(CONTEXT.PRAISAL_MANAGER)
    const cubeNames = [...praisalManager.cubes.keys()]
    const [selected, setSelected] = React.useState<string[]>(() => [])

    const title = (<>
        <IconBrowse className={classes.icon} />
        {heading}
    </>)

    const handleChange = (event: React.ChangeEvent<{}>, value: string[]) => {
        setSelected(value)
    }

    const handleRemove = (event: React.SyntheticEvent<any, Event>) => {
        const id = event.currentTarget.parentElement.innerText
        const index = selected.findIndex((innerId) => id === innerId)
        setSelected([...selected.slice(0, index), ...selected.slice(index + 1)])
    }

    return (
        <Card className={clsx(classes.root, className)} {...otherProps}>
            <CardHeader title={title} classes={{root: classes.header, title: classes.title}} />
            <CardContent className={classes.content}>
                <Autocomplete
                    multiple
                    value={selected}
                    onChange={handleChange}
                    id='tags-filled'
                    disableCloseOnSelect
                    options={cubeNames}
                    renderTags={(value: string[])=>null}
                    renderInput={(params) => (
                        <TextField
                            color='secondary'
                            className={classes.textField}
                            {...params}
                            variant='outlined'
                            placeholder='Select ID of blocks ...'
                        />
                    )}
                />
            </CardContent>
            <CardContent className={classes.content}>
                {selected.map((id: string, index: number) => (
                    <Chip variant='outlined' key={id} size='small' label={id} className={classes.chip} onDelete={handleRemove} />
                ))}
            </CardContent>
        </Card>
    )
})) /* ============================================================================================================= */
