import { ObservableMap as ObservableMapMobx } from 'mobx'

export class ObservableMap<TValue> extends ObservableMapMobx<string, TValue> {

  public map<T>(callback: (value: TValue, key: string) => T): T[] {
    const results: T[] = []
    // tslint:disable-next-line:no-for-each-push - because observableMap doesn't have map natively.
    this.forEach((value: TValue, key: string) => results.push(callback(value, key)))

    return results
  }

  public reduce<T>(callback: (previous: T, value: TValue, key: string) => T, initValue: T): T {
    let result = initValue
    this.forEach((value: TValue, key: string) => result = callback(result, value, key))

    return result
  }

  public toArray(): TValue[] {
    return this.map((value) => value)
  }

}
