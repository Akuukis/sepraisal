import { IBlueprint } from '../IBlueprint'


export abstract class AbstractBpClass<TTitle extends string = string, TParent extends string | void = void> {
    public readonly children: Array<AbstractBpClass<string, TTitle>> = []
    public abstract readonly criteriaToFind: Array<{}>
    public abstract readonly criteriaToTrain: Array<{}>
    public abstract readonly distributions: Array<keyof IBlueprint.ISbc>
    public readonly parent?: AbstractBpClass
    public abstract readonly title: TTitle

    public constructor(parent: TParent extends string ? AbstractBpClass<TParent> : void) {
        if(parent instanceof AbstractBpClass) {
            parent.children.push(this)
            this.parent = parent
        }
    }
}
