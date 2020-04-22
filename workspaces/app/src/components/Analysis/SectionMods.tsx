import { IBlueprint } from '@sepraisal/common'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'

import { Link } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme, linkBp } from '../../common/'
import ValueCell from '../../components/Cell/ValueCell'
import CenterCell from '../Cell/CenterCell'
import HeaderCell from '../Cell/HeaderCell'
import MyBox from '../MyBox'
import MyBoxGroup from '../MyBoxGroup'
import MySection from '../MySection'


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
})


interface IProps {
    bp: IBpProjectionRow
}


export default hot(createSmartFC(styles, __filename)<IProps>(({children, classes, theme, ...props}) => {
    const {bp} = props


    const mods = bp.steam.mods.map((mod) => (
        (<div>- <Link href={linkBp(mod.id as number)} target='_blank' rel='noreferrer noopener' variant='body2' noWrap>
            {mod.title ?? mod.id}
        </Link></div>)
    ))

    // TODO: Fix backend to have "unknownBlocks" just like "blocks".

    // const modblocks = (Object.entries(sbc.unknownDefinitions))
    //     .map(([block, amount]) => ({block, amount}))
    //     .sort((a, b) => b.amount - a.amount)
    //     .map(({blockType, amount}) => `${amount}x ${blockType}`)
    //     .join('\n')

    return (
        <MySection className={classes.root}>
            <MyBoxGroup>
                <MyBox width={2} flat>
                    <HeaderCell width={2} title='MODS' />
                </MyBox>
                <MyBox>
                    <ValueCell label={`vanilla`} value={bp.sbc.vanilla ? 'Yes' : 'No'}/>
                </MyBox>
                <MyBox>
                    <ValueCell label={`listed mods`} value={mods.length}/>
                </MyBox>
                <MyBox width={2}>
                    <ValueCell label={`unique m.blocks`} value={'?'}/>
                    <ValueCell label={`total m.blocks`} value={'?'}/>
                </MyBox>
            </MyBoxGroup>
            <MyBoxGroup height={2} width={6}>
                <MyBox width={6}>
                    <ValueCell width={2} label={`dependencies in steam.`} value={'Listed Mods:'} justify='flex-start' alignItems='flex-end'/>
                    <CenterCell width={4} padded direction='column' justify='flex-start' alignItems='flex-start' wrap='nowrap'>
                        {mods}
                    </CenterCell>
                </MyBox>
            </MyBoxGroup>
            {/* <MyBoxGroup height={2} width={6}>
                <MyBox width={6}>
                    <ValueCell width={2} label={`found in the blueprint.`} value={'non-Vanilla blocks:'} justify='flex-start' alignItems='flex-end'/>
                    <CenterCell width={4} direction='column' justify='flex-start' alignItems='flex-start'>
                        <Typography className={classes.contentText} component='pre' variant='body2'>
                            {modblocks}
                        </Typography>
                    </CenterCell>
                </MyBox>
            </MyBoxGroup> */}
        </MySection>
    )
})) /* ============================================================================================================= */


type ProjectionCardSteam =
    | 'mods'

type ProjectionCardSbc =
    | 'unknownDefinitions'
    | 'vanilla'

interface IBpProjectionRow {
    steam: {[key in keyof Pick<IBlueprint.ISteam, ProjectionCardSteam>]: IBlueprint.ISteam[key]}
    sbc: {[key in keyof Pick<IBlueprint.ISbc, ProjectionCardSbc>]: IBlueprint.ISbc[key]}
}
