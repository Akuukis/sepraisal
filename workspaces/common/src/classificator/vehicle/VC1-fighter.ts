import { IBlueprint } from '../../IBlueprint'
import { AbstractBpClass } from '../Class'
import { VC1 } from './VC1-_default'

export class Fighter extends AbstractBpClass<'fighter', VC1['title']> {
    public readonly criteriaToFind = [
        {$or: [
            {blocksSmartUnique: 'SmallGatlingGun/'},
            {blocksSmartUnique: 'SmallMissileLauncher/'},
        ]},
        // gridType !== station
    ]
    public readonly criteriaToTrain = [
        ...this.criteriaToFind,
        {$text: { $search: 'fighter bomber strike craft' } },
    ]
    public readonly distributions: Array<keyof IBlueprint.ISbc> = [
        'blockCount',
        'blockMass',
        'blockPCU',
        'oreVolume',
    ]

    public title = 'fighter' as const
}
