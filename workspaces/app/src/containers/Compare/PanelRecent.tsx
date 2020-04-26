import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { List, ListItem, Typography } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../../common'
import MyExpansionPanel from '../../components/MyExpansionPanel'
import { CONTEXT } from '../../stores'
import SelectorRow from './Row'

const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    list: {
    }
})


interface IProps {
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const blueprintStore = React.useContext(CONTEXT.BLUEPRINTS)

    return (
        <MyExpansionPanel className={classes.root} title='Recent' subtitle={`${blueprintStore.recent.size} blueprints`} defaultExpanded>
            <List dense className={classes.list}>
                <ListItem key='0'>
                    <Typography color='textSecondary' variant='body2' align='center'>
                        Recently viewed blueprints will show up here.
                    </Typography>
                </ListItem>
                {[...blueprintStore.recent].map<JSX.Element>(([id, blueprint]) => (
                        <SelectorRow
                            key={id}
                            id={id}
                            title={blueprint?.steam?.title ?? id}
                        />
                    ))}
            </List>
        </MyExpansionPanel>
    )
})) /* ============================================================================================================= */
