import { IBlueprint } from '../../IBlueprint'
import { AbstractBpClass } from '../Class'
import { Vehicle } from './vehicle'

export class VC0 extends AbstractBpClass<'V0', Vehicle['title']> {
    public readonly criteriaToFind = [
    // NOT cockpit
    ]
    public readonly criteriaToTrain = [
        ...this.criteriaToFind,
    ]
    public readonly distributions: Array<keyof IBlueprint.ISbc> = [
    ]

    public title = 'V0' as const
}
