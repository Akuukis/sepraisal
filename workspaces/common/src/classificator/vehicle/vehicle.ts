import { IBlueprint } from '../../IBlueprint'
import { AbstractBpClass } from '../Class'

export class Vehicle extends AbstractBpClass<'vehicle'> {
    public readonly criteriaToFind = {
        $and: [
            // gridType !== station
        ],
    }
    public readonly criteriaToTrain = {
        $and: [
            ...this.criteriaToFind.$and,
            {vanilla: true},
        ],
    }
    public readonly distributions: Array<keyof IBlueprint.ISbc> = [
    ]

    public title = 'vehicle' as const
}
