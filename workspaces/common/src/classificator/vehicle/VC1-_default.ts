import { IBlueprint } from '../../IBlueprint'
import { AbstractBpClass } from '../Class'
import { Vehicle } from './vehicle'

export class VC1 extends AbstractBpClass<'V1', Vehicle['title']> {
    public readonly criteriaToFind = [
        {gridSize: 'Small' },
        {blocksSmartUnique: 'Gyro/SmallBlockGyro'},
        {$or: [
            {blocksSmartUnique: 'BatteryBlock/SmallBlockBatteryBlock'},
            {blocksSmartUnique: 'Reactor/SmallBlockSmallGenerator'},
            {blocksSmartUnique: 'Reactor/SmallBlockLargeGenerator'},
        ]},
        {$or: [
            {blocksSmartUnique: 'Cockpit/SmallBlockCockpit'},
            {blocksSmartUnique: 'Cockpit/DBSmallBlockFighterCockpit'},
        ]},
        {$or: [
            {blocksSmartUnique: 'SmallGatlingGun/'},
            {blocksSmartUnique: 'SmallMissileLauncher/'},
        ]},
    ]
    public readonly criteriaToTrain = [
        ...this.criteriaToFind,
    ]
    public readonly distributions: Array<keyof IBlueprint.ISbc> = [
    ]

    public title = 'V1' as const
}
