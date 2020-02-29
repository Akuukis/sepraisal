import { IBlueprint } from '../../IBlueprint'
import { AbstractBpClass } from '../Class'
import { VC1 } from './VC1-_default'

export class Fighter extends AbstractBpClass<'fighter', VC1['title']> {
    public readonly criteriaToFind = {
        $and: [
            ...this.parent!.criteriaToFind.$and,
            {$or: [
                {'sbc.blocks.SmallGatlingGun/': {$exists: true}},
                {'sbc.blocks.SmallMissileLauncher/': {$exists: true}},
            ]},
            // gridType !== station
        ],
    }
    public readonly criteriaToTrain = {
        $and: [
            ...this.criteriaToFind.$and,
        ],
        $text: { $search: 'fighter bomber strike craft' },
    }
    public readonly distributions: Array<keyof IBlueprint.ISbc> = [
        'blockCount',
        'blockMass',
        'blockPCU',
        'oreVolume',
    ]

    public title = 'fighter' as const
}
