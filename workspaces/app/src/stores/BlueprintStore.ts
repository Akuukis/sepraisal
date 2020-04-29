import { API_URL, IBlueprint, ObservableMap, RequiredSome } from '@sepraisal/common'
import { Praisal } from '@sepraisal/praisal'
import { action, runInAction } from 'mobx'
import moment from 'moment'

import { FavoriteStore } from './FavoriteStore'

// tslint:disable-next-line: min-class-cohesion
export class BlueprintStore {
    public readonly recent = new ObservableMap<BlueprintStore.ICachedSteamBlueprint, number>()
    public readonly uploads = new ObservableMap<BlueprintStore.ICachedUploadBlueprint>()

    private favoriteStore: FavoriteStore

    public constructor(favoriteStore: FavoriteStore) {
        this.favoriteStore = favoriteStore
        const keys = Array.from({length: localStorage.length}).map((_, i) => localStorage.key(i))
        runInAction(() => {
            for(const key of keys) {
                if(key === null) continue
                const value = localStorage.getItem(key)
                if(value === null) continue

                if(key.slice(0, `recent/`.length) === 'recent/') {
                    this.recent.set(Number(key.slice(`recent/`.length)), JSON.parse(value) as BlueprintStore.ICachedSteamBlueprint)
                }
                if(key.slice(0, `upload/`.length) === 'upload/') {
                    this.uploads.set(key.slice(`upload/`.length), JSON.parse(value) as BlueprintStore.ICachedUploadBlueprint)
                }
            }
        })
    }

    public deleteSomething(idOrTitle: number | string): boolean {
        if(typeof idOrTitle === 'string') {
            return this.deleteUpload(idOrTitle)
        } else {
            return this.deleteRecent(idOrTitle)
        }
    }

    public getSomething(id: number): BlueprintStore.ICachedSteamBlueprint
    public getSomething(title: string): BlueprintStore.ICachedUploadBlueprint
    public getSomething(idOrTitle: number | string): BlueprintStore.ICachedSteamBlueprint | BlueprintStore.ICachedUploadBlueprint
    public getSomething(idOrTitle: number | string) {
        if(typeof idOrTitle === 'string') {
            const upload = this.uploads.get(idOrTitle)
            if(upload) return upload
        } else {
            const recent = this.recent.get(idOrTitle)
            if(recent) return recent
        }

        return null
    }

    @action public deleteRecent(id: number) {
        localStorage.removeItem(`recent/${id}`)
        return this.recent.delete(id)
    }

    @action public deleteUpload(title: string) {
        if(this.favoriteStore.has(title)) this.favoriteStore.shift(title)
        localStorage.removeItem(`upload/${title}`)
        return this.uploads.delete(title)
    }

    @action public setRecent(blueprint: RequiredSome<IBlueprint, 'sbc' | 'steam'>) {
        const id = blueprint._id
        const _cached = moment()

        localStorage.setItem(`recent/${id}`, JSON.stringify({...blueprint, _cached: _cached.toString()}))
        this.recent.set(id, {...blueprint, _cached})

        return id
    }

    @action public async fetch(id: number) {
        const find = encodeURIComponent(JSON.stringify({_id: id}))
        const res = await fetch(`${API_URL}?find=${find}&limit=${1}`)
        const {docs} = await res.json() as {docs: Array<RequiredSome<IBlueprint, 'sbc' | 'steam'>>}
        const doc = docs.pop()

        if(!doc) throw new Error('Not Found.')

        runInAction('blueprintStore.fetch', () => {
            this.setRecent(doc)
        })
        return doc
    }

    @action public setUpload(praisal: Praisal) {
        const blueprint: BlueprintStore.ICachedUploadBlueprint = {
            _id: 0,
            sbc: praisal.toBlueprintSbc(0),
            _cached: moment(),
        }
        const title = `${praisal.blummary.title}-${moment().format('MMDD-HHmmss')}`
        localStorage.setItem(`upload/${title}`, JSON.stringify({...blueprint, _cached: blueprint._cached.toString()}))
        this.uploads.set(title, blueprint)

        return title
    }

}

export namespace BlueprintStore {
    export interface ICachedSteamBlueprint extends RequiredSome<IBlueprint, 'sbc' | 'steam'> {
        _cached: moment.Moment
    }
    export interface ICachedUploadBlueprint extends RequiredSome<IBlueprint, 'sbc'> {
        _cached: moment.Moment
    }
}
