import { ObservableMap as ObservableMapMobx } from 'mobx'

export class ObservableMap<TValue, TKey extends number|string = string> extends ObservableMapMobx<TKey, TValue> {

    public map<T>(callback: (value: TValue, key: TKey) => T): T[] {
        const results: T[] = []
        // tslint:disable-next-line:no-for-each-push - because observableMap doesn't have map natively.
        this.forEach((value: TValue, key: TKey) => results.push(callback(value, key)))

        return results
    }

    public reduce<T>(callback: (previous: T, value: TValue, key: TKey) => T, initValue: T): T {
        let result = initValue
        this.forEach((value: TValue, key: TKey) => result = callback(result, value, key))

        return result
    }

    public toArray(): TValue[] {
        return this.map((value) => value)
    }

}
