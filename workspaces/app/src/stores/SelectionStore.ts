import { observable, IObservableArray } from 'mobx';
import { IBlueprint, RequiredSome } from '@sepraisal/common';

export class SelectionStore {
    // public readonly selected: IObservableArray<RequiredSome<IBlueprint, "sbc">> = observable([])
    public readonly selected: IObservableArray<string> = observable([])
}
