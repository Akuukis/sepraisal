import { IBlueprint } from '../../IBlueprint'
import { AbstractBpClass } from '../Class'

export class Vehicle extends AbstractBpClass<'vehicle'> {
    public readonly criteriaToFind = [
        // gridType !== station
    ]
    public readonly criteriaToTrain = [
        ...this.criteriaToFind,
        {vanilla: true},
    ]
    public readonly distributions: Array<keyof IBlueprint.ISbc> = [
    ]

    public title = 'vehicle' as const
}
