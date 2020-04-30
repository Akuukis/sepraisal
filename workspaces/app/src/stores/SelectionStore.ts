import { action, computed, IObservableArray, observable } from 'mobx'

interface IItem {
    id: number
    name: string
}

export class SelectionStore {
    // public readonly selected: IObservableArray<RequiredSome<IBlueprint, "sbc">> = observable([])
    public readonly selected: IObservableArray<string | number> = observable([])

    @computed public get selectedItems(): IItem[] {
        return this.selected.map((id) => ({
            id: id as number,
            name: id as string,
        }))
    }

    public setSelectedItems = action((items: IItem[]) => {
        this.selected.replace(items.map(({id}) => id))
    })

}
