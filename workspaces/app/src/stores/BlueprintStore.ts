import { IBlueprint, ObservableMap, RequiredSome } from '@sepraisal/common'
import { Praisal } from '@sepraisal/praisal'
import { action, runInAction } from 'mobx'
import * as moment from 'moment'

// tslint:disable-next-line: min-class-cohesion
export class BlueprintStore {
    public readonly recent = new ObservableMap<RequiredSome<IBlueprint, 'sbc' | 'steam'>, number>()
    public readonly favorites = new ObservableMap<RequiredSome<IBlueprint, 'sbc' | 'steam'>, number>()
    public readonly uploads = new ObservableMap<RequiredSome<IBlueprint, 'sbc'>>()

    public constructor() {
        const keys = Array.from({length: localStorage.length}).map((_, i) => localStorage.key(i))
        runInAction(() => {
            for(const key of keys) {
                if(key === null) continue
                const value = localStorage.getItem(key)
                if(value === null) continue

                if(key.slice(0, `recent/`.length) === 'recent/') {
                    this.recent.set(Number(key.slice(`recent/`.length)), JSON.parse(value) as RequiredSome<IBlueprint, 'sbc' | 'steam'>)
                }
                if(key.slice(0, `favorite/`.length) === 'favorite/') {
                    this.favorites.set(Number(key.slice(`favorite/`.length)), JSON.parse(value) as RequiredSome<IBlueprint, 'sbc' | 'steam'>)
                }
                if(key.slice(0, `upload/`.length) === 'upload/') {
                    this.uploads.set(key.slice(`upload/`.length), JSON.parse(value) as RequiredSome<IBlueprint, 'sbc'>)
                }
            }
        })
    }

    public deleteSomething(idOrTitle: number | string): boolean {
        if(typeof idOrTitle === 'string') {
            return this.uploads.delete(idOrTitle)
        } else {
            const favorite = this.favorites.delete(idOrTitle)
            const recent = this.favorites.delete(idOrTitle)
            return favorite || recent
        }
    }

    public getSomething(id: number): RequiredSome<IBlueprint, 'sbc' | 'steam'>
    public getSomething(title: string): RequiredSome<IBlueprint, 'sbc'>
    public getSomething(idOrTitle: number | string): RequiredSome<IBlueprint, 'sbc' | 'steam'> | RequiredSome<IBlueprint, 'sbc'>
    public getSomething(idOrTitle: number | string) {
        if(typeof idOrTitle === 'string') {
            const upload = this.uploads.get(idOrTitle)
            if(upload) return upload

            throw new Error(`No Upload titled "${idOrTitle}"`)
        } else {
            const favorite = this.favorites.get(idOrTitle)
            if(favorite) return favorite

            const recent = this.recent.get(idOrTitle)
            if(recent) return recent

            throw new Error(`No Favorite nor Recent with id "${idOrTitle}"`)
        }
    }

    @action public deleteRecent(id: number) {
        this.recent.delete(id)
        localStorage.removeItem(`recent/${id}`)
    }

    @action public deleteFavorite(id: number) {
        this.recent.delete(id)
        localStorage.removeItem(`favorite/${id}`)
    }

    @action public deleteUpload(title: string) {
        this.uploads.delete(title)
        localStorage.removeItem(`upload/${title}`)
    }

    @action public setRecent(blueprint: RequiredSome<IBlueprint, 'sbc' | 'steam'>) {
        localStorage.setItem(`recent/${blueprint._id}`, JSON.stringify(blueprint))
        this.recent.set(blueprint._id, blueprint)

        return blueprint._id
    }

    @action public setFavorite(blueprint: RequiredSome<IBlueprint, 'sbc' | 'steam'>) {
        localStorage.setItem(`favorite/${blueprint._id}`, JSON.stringify(blueprint))
        this.favorites.set(blueprint._id, blueprint)

        return blueprint._id
    }

    @action public setUpload(praisal: Praisal) {
        const blueprint: RequiredSome<IBlueprint, 'sbc'> = {
            _id: 0,
            sbc: praisal.toBlueprintSbc(0),
        }
        const title = `${praisal.blummary.title}-${moment().format('MMDD-HHmmss')}`
        localStorage.setItem(`upload/${title}`, JSON.stringify(blueprint))
        this.uploads.set(title, blueprint)

        return title
    }

}
