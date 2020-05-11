import { action, observable } from 'mobx'


export class ExclusiveScopeStore {
    @observable public value: string | null = null

    public setValue = action((value: string | null) => {
        this.value = value
    })
}
