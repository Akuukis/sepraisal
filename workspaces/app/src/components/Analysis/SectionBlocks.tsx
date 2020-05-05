import { IBlueprint } from '@sepraisal/common'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { createSmartFC, createStyles, IMyTheme } from '../../common/'
import Table from '../../components/Table'
import MyBox from '../MyBox'
import MyBoxColumn from '../MyBoxColumn'
import MyBoxRow from '../MyBoxRow'
import MySection from './MySection'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    contentTable: {
        width: '100%',
    },
})


interface IProps {
    bp: IBpProjectionRow
    long?: boolean
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {bp, long} = props
    const sbc = bp.sbc

    const blocks = (Object.entries(sbc.blocks))
        .map(([block, count]) => ({block, count}))
        .sort((a, b) => b.count - a.count)

    return (
        <MySection heading='Blocks' label='block count' value={sbc.blockCount}>
            <MyBoxColumn width={3}>
                <MyBoxRow>
                </MyBoxRow>
            </MyBoxColumn>
            <MyBoxColumn height={long ? 0 : 5}>
                <MyBoxRow width={6}>
                    <MyBox width={6}>
                        <Table
                            className={classes.contentTable}
                            columns={Object.keys(datumTitles)}
                            headers={datumTitles}
                            data={blocks}
                        />
                    </MyBox>
                </MyBoxRow>
            </MyBoxColumn>
        </MySection>
    )
})) /* ============================================================================================================= */


const datumTitles = {
    block: 'Block ID',
    count: 'Count',
}

type ProjectionCardSbc =
    | 'blocks'
    | 'blockCount'

interface IBpProjectionRow {
    sbc: {[key in keyof Pick<IBlueprint.ISbc, ProjectionCardSbc>]: IBlueprint.ISbc[key]},
}
