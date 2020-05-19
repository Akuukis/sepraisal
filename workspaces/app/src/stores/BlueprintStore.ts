import { IBlueprint, ObservableMap, RequiredSome } from '@sepraisal/common'
import { Praisal } from '@sepraisal/praisal'
import { action, computed, runInAction } from 'mobx'
import moment from 'moment'

import { getApiUrl } from 'src/common'

import { FavoriteStore } from './FavoriteStore'

// tslint:disable-next-line: min-class-cohesion
export class BlueprintStore {
    public readonly recent = new ObservableMap<BlueprintStore.ICachedSteamBlueprint, number>()
    public readonly uploads = new ObservableMap<BlueprintStore.ICachedUploadBlueprint>()

    @computed public get uploadsArray(): [string, BlueprintStore.ICachedUploadBlueprint][] {
        return [...this.uploads]
            .sort((a, b) => b[1]._cached.diff(a[1]._cached))
    }

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
                    const cachedBlueprint = JSON.parse(value) as BlueprintStore.ICachedSteamBlueprint
                    cachedBlueprint._cached = moment(cachedBlueprint._cached)
                    this.recent.set(Number(key.slice(`recent/`.length)), cachedBlueprint)
                }
                if(key.slice(0, `upload/`.length) === 'upload/') {
                    const uploadedBlueprint = JSON.parse(value) as BlueprintStore.ICachedUploadBlueprint
                    uploadedBlueprint._cached = moment(uploadedBlueprint._cached)
                    this.uploads.set(key.slice(`upload/`.length), uploadedBlueprint)
                }
            }
        })
    }

    @computed public get size() {
        // Trigger when recent or uploads changes.
        let size = 0 * (this.recent.size + this.uploads.size)

        const keys = Array.from({length: localStorage.length}).map((_, i) => localStorage.key(i))
        for(const key of keys) {
            if(key === null) continue
            size = size + key.length

            const value = localStorage.getItem(key)
            if(value === null) continue
            size = size + value.length
        }

        return size
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

    public deleteRecentsPast100 = action(() => {
        if(this.recent.size <= 100) return

        const recents = [...this.recent.entries()]
            .sort(([_, a], [__, b]) => b._cached.diff(a._cached))

        const remaining = recents.slice(0, 100)
        const deletes = recents.slice(100)

        this.recent.replace(remaining)
        deletes.forEach(([id]) => {
            localStorage.removeItem(`recent/${id}`)
        })
    })

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
        const res = await fetch(getApiUrl([{_id: {$eq: id}}], {limit: 1}))
        const {docs} = await res.json() as {docs: Array<RequiredSome<IBlueprint, 'sbc' | 'steam'>>}
        const doc = docs.pop()

        if(!doc) throw new Error('Not Found.')

        runInAction('blueprintStore.fetch', () => {
            this.setRecent(doc)
        })
        return doc
    }

    public setUpload(praisal: Praisal): string
    public setUpload(praisal: BlueprintStore.ICachedUploadBlueprint, title: string): string
    @action public setUpload(praisalOrCached: Praisal | BlueprintStore.ICachedUploadBlueprint, title?: string): string {
        let titleFinal: string
        let blueprint: BlueprintStore.ICachedUploadBlueprint
        if(praisalOrCached instanceof Praisal) {
            titleFinal = `${praisalOrCached.blummary.title}-${moment().format('MMDD-HHmmss')}`
            blueprint = {
                _id: 0,
                sbc: praisalOrCached.toBlueprintSbc(0),
                _cached: moment(),
            }
        } else {
            titleFinal = title!
            blueprint = praisalOrCached
        }
        localStorage.setItem(`upload/${titleFinal}`, JSON.stringify({...blueprint, _cached: blueprint._cached.toString()}))
        this.uploads.set(titleFinal, blueprint)

        return titleFinal
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
