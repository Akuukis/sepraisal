import { IBlueprint } from '@sepraisal/common'
import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { createSmartFC, createStyles, IMyTheme } from 'src/common'
import ValueCell from 'src/components/Cell/ValueCell'

import MyBox from '../MyBox'
import MyBoxColumn from '../MyBoxColumn'
import MyBoxRow from '../MyBoxRow'
import Table from '../Table'
import MySection from './MySection'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },

    contentText: {
        paddingBottom: theme.spacing(2),
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
        paddingTop: theme.spacing(2),
        width: '100%',
        overflowY: 'scroll',
    },
    contentTable: {
        width: '100%',
    },
})


interface IProps extends Omit<React.ComponentProps<typeof MySection>, 'heading' | 'value' | 'label'> {
    bp: IBpProjectionRow
    long?: boolean
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {bp, className, long, ...otherProps} = props


    const moddedBlocks = Object.entries(bp.sbc.missingDefinitions.blocks)
        .map(([fullType, amount]) => ({fullType, amount}))
    const totalModdedBlocks = bp.sbc.blockCountTotal - bp.sbc.blockCount

    // TODO: Fix backend to have "unknownBlocks" just like "blocks".

    // const modblocks = (Object.entries(sbc.unknownDefinitions))
    //     .map(([block, amount]) => ({block, amount}))
    //     .sort((a, b) => b.amount - a.amount)
    //     .map(({blockType, amount}) => `${amount}x ${blockType}`)
    //     .join('\n')

    return (
        <MySection heading='Mods' label='status' value={bp.sbc.vanilla ? 'Vanilla' : 'Modded'} className={clsx(classes.root, className)} {...otherProps}>
            <MyBoxColumn width={3}>
                <MyBoxRow width={3}>
                    <MyBox width={3}>
                        <ValueCell label={`req. DLCs`} value={bp.sbc.DLCsCount || '-'}/>
                        <ValueCell label={`unique m.blocks`} value={bp.sbc.missingDefinitionsCount || '-'}/>
                        <ValueCell label={`total m.blocks`} value={totalModdedBlocks || '-'}/>
                    </MyBox>
                </MyBoxRow>
            </MyBoxColumn>
            <MyBoxColumn height={5} width={6}>
                <MyBoxRow height={5} width={6}>
                    <MyBox width={6}>
                        <Table
                            className={classes.contentTable}
                            columns={['fullType', 'amount']}
                            headers={{fullType: 'Modded Block Type', amount: 'Amount'}}
                            data={moddedBlocks}
                        />
                    </MyBox>
                </MyBoxRow>
            </MyBoxColumn>
            {/* <MyBoxColumn height={2} width={6}>
                <MyBox width={6}>
                    <ValueCell width={2} label={`found in the blueprint.`} value={'non-Vanilla blocks:'} justify='flex-start' alignItems='flex-end'/>
                    <CenterCell width={4} direction='column' justify='flex-start' alignItems='flex-start'>
                        <Typography className={classes.contentText} component='pre' variant='body2'>
                            {modblocks}
                        </Typography>
                    </CenterCell>
                </MyBox>
            </MyBoxColumn> */}
        </MySection>
    )
})) /* ============================================================================================================= */


type ProjectionCardSbc =
    | 'blockCount'
    | 'blockCountTotal'
    | 'missingDefinitions'
    | 'missingDefinitionsCount'
    | 'DLCs'
    | 'DLCsCount'
    | 'vanilla'

interface IBpProjectionRow {
    sbc: {[key in keyof Pick<IBlueprint.ISbc, ProjectionCardSbc>]: IBlueprint.ISbc[key]}
}
