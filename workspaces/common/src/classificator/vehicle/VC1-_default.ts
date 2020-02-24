import { IBlueprint } from '../../IBlueprint'
import { AbstractBpClass } from '../Class'
import { Vehicle } from './vehicle'

export class VC1 extends AbstractBpClass<'V1', Vehicle['title']> {
    public readonly criteriaToFind = {
        $and: [
            {'sbc.gridSize': 'Small' },
            {'sbc.blocks.Gyro/SmallBlockGyro': {$exists: true}},
            {$or: [
                {'sbc.blocks.BatteryBlock/SmallBlockBatteryBlock': {$exists: true}},
                {'sbc.blocks.Reactor/SmallBlockSmallGenerator': {$exists: true}},
                {'sbc.blocks.Reactor/SmallBlockLargeGenerator': {$exists: true}},
            ]},
            {$or: [
                {'sbc.blocks.Cockpit/SmallBlockCockpit': {$exists: true}},
                {'sbc.blocks.Cockpit/DBSmallBlockFighterCockpit': {$exists: true}},
            ]},
            {$or: [
                {'sbc.blocks.SmallGatlingGun/': {$exists: true}},
                {'sbc.blocks.SmallMissileLauncher/': {$exists: true}},
            ]},
        ],
    }
    public readonly criteriaToTrain = {
        $and: [
            ...this.criteriaToFind.$and,
        ],
    }
    public readonly distributions: Array<keyof IBlueprint.ISbc> = [
    ]

    public title = 'V1' as const
}
