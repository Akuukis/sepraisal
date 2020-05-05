import { action, computed, IObservableArray, observable } from 'mobx'

interface IItem {
    id: number
    name: string
}

export class SelectionStore {
    // public readonly selected: IObservableArray<RequiredSome<IBlueprint, "sbc">> = observable([])
    public readonly selected: IObservableArray<string | number> = observable([])
    @observable public narrow: boolean = false

    @computed public get selectedItems(): IItem[] {
        return this.selected.map((id) => ({
            id: id as number,
            name: id as string,
        }))
    }

    public setSelectedItems = action('selectionStore.setSelectedItems', (items: IItem[]) => {
        this.selected.replace(items.map(({id}) => id))
    })

    public setNarrow = action('selectionStore.setNarrow', (value: boolean) => {
        this.narrow = value
    })

}
