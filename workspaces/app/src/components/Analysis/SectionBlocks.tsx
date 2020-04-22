import { IBlueprint } from '@sepraisal/common'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { createSmartFC, createStyles, IMyTheme } from '../../common/'
import Table from '../../components/Table'
import HeaderCell from '../Cell/HeaderCell'
import MyBox from '../MyBox'
import MyBoxGroup from '../MyBoxGroup'
import MySection from '../MySection'



const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    contentTable: {
        width: '100%',
    },
})


interface IProps {
    bp: IBpProjectionRow
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const sbc = props.bp.sbc

    const blocks = (Object.entries(sbc.blocks))
        .map(([block, count]) => ({block, count}))
        .sort((a, b) => b.count - a.count)

    return (
        <MySection className={classes.root}>
            <MyBoxGroup>
                <MyBox width={2} header>
                    <HeaderCell title='BLOCKS' />
                </MyBox>
                <MyBox>
                </MyBox>
            </MyBoxGroup>
            <MyBoxGroup height={8}>
                <MyBox width={6}>
                    <Table
                        className={classes.contentTable}
                        columns={Object.keys(datumTitles)}
                        headers={datumTitles}
                        data={blocks}
                    />
                </MyBox>
            </MyBoxGroup>
        </MySection>
    )
})) /* ============================================================================================================= */


const datumTitles = {
    block: 'Block ID',
    count: 'Count',
}

type ProjectionCardSbc =
    | 'blocks'

interface IBpProjectionRow {
    sbc: {[key in keyof Pick<IBlueprint.ISbc, ProjectionCardSbc>]: IBlueprint.ISbc[key]},
}
