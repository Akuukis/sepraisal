import { IBlueprint } from '@sepraisal/common'
import clsx from 'clsx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { createSmartFC, createStyles, formatDecimal, IMyTheme } from 'src/common'
import ValueCell from 'src/components/Cell/ValueCell'

import MyBox from '../MyBox'
import MyBoxColumn from '../MyBoxColumn'
import MyBoxRow from '../MyBoxRow'
import MySection from './MySection'


const styles = (theme: IMyTheme) => createStyles({
    root: {
    },
})


interface IProps extends Omit<React.ComponentProps<typeof MySection>, 'heading' | 'value' | 'label'> {
    bp: IBpProjectionRow
    long?: boolean
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {bp, className, long, ...otherProps} = props
    const {sbc} = bp
    const mass = sbc.blockMass

    const decoys = (sbc.blocks['Decoy/LargeDecoy'] ?? 0) + (sbc.blocks['Decoy/SmallDecoy'] ?? 0)
    const welders = (sbc.blocks['ShipWelder/LargeShipWelder'] ?? 0) + (sbc.blocks['ShipWelder/SmallShipWelder'] ?? 0)

    return (
        <MySection heading='Defensive' label='Hit Points' value={formatDecimal(sbc.blockIntegrity)} className={clsx(classes.root, className)} {...otherProps}>
            <MyBoxColumn width={3}>
                <MyBoxRow width={3}>
                    <MyBox>
                        <ValueCell label={`decoys`} value={decoys || '-'} />
                    </MyBox>
                    <MyBox>
                        <ValueCell label={`welders`} value={welders || '-'} />
                    </MyBox>
                </MyBoxRow>
            </MyBoxColumn>
        </MySection>
    )
})) /* ============================================================================================================= */


type ProjectionCardSbc =
    | 'blocks'
    | 'blockMass'
    | 'blockIntegrity'

interface IBpProjectionRow {
    sbc: {[key in keyof Pick<IBlueprint.ISbc, ProjectionCardSbc>]: IBlueprint.ISbc[key]},
}
