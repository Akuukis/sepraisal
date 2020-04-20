import { IBlueprint, ObservableMap, RequiredSome } from '@sepraisal/common'
import { Praisal } from '@sepraisal/praisal'
import { action, runInAction } from 'mobx'
import * as moment from 'moment'

// tslint:disable-next-line: min-class-cohesion
export class BlueprintStore {
    public readonly recent = new ObservableMap<RequiredSome<IBlueprint, 'sbc' | 'steam'>>()
    public readonly favorites = new ObservableMap<RequiredSome<IBlueprint, 'sbc' | 'steam'>>()
    public readonly uploads = new ObservableMap<RequiredSome<IBlueprint, 'sbc'>>()

    public constructor() {
        const keys = Array.from({length: localStorage.length}).map((_, i) => localStorage.key(i))
        runInAction(() => {
            for(const key of keys) {
                if(key === null) continue
                const value = localStorage.getItem(key)
                if(value === null) continue

                if(key.slice(0, `recent/`.length) === 'recent/') {
                    this.recent.set(key.slice(`recent/`.length), JSON.parse(value) as RequiredSome<IBlueprint, 'sbc' | 'steam'>)
                }
                if(key.slice(0, `favorite/`.length) === 'favorite/') {
                    this.favorites.set(key.slice(`favorite/`.length), JSON.parse(value) as RequiredSome<IBlueprint, 'sbc' | 'steam'>)
                }
                if(key.slice(0, `upload/`.length) === 'upload/') {
                    this.uploads.set(key.slice(`upload/`.length), JSON.parse(value) as RequiredSome<IBlueprint, 'sbc'>)
                }
            }
        })
    }

    @action public deleteRecent(title: string) {
        this.recent.delete(title)
        localStorage.removeItem(`recent/${title}`)
    }

    @action public deleteFavorite(title: string) {
        this.recent.delete(title)
        localStorage.removeItem(`favorite/${title}`)
    }

    @action public deleteUpload(title: string) {
        this.uploads.delete(title)
        localStorage.removeItem(`upload/${title}`)
    }

    @action public setRecent(blueprint: RequiredSome<IBlueprint, 'sbc' | 'steam'>) {
        const title = `${blueprint._id}-${blueprint.steam.revision}`
        localStorage.setItem(`recent/${title}`, JSON.stringify(blueprint))
        this.recent.set(title, blueprint)

        return title
    }

    @action public setFavorite(blueprint: RequiredSome<IBlueprint, 'sbc' | 'steam'>) {
        const title = `${blueprint._id}-${blueprint.steam.revision}`
        localStorage.setItem(`favorite/${title}`, JSON.stringify(blueprint))
        this.favorites.set(title, blueprint)

        return title
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
