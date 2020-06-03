import { ObservableMap } from '@sepraisal/common/src'
import { PraisalManager } from '@sepraisal/praisal'
import { createContext } from 'react'

import { GridSizeColumns } from 'src/common'

import { PiwikAnalyticsStore } from './Analytics/PiwikAnalyticsStore'
import { BlueprintStore } from './BlueprintStore'
import { CardStore } from './CardStore'
import { ExclusiveScopeStore } from './ExclusiveScopeStore'
import { FavoriteStore } from './FavoriteStore'
import { RouterStore } from './RouterStore'
import { SelectionStore } from './SelectionStore'

// tslint:disable: no-any
export const CONTEXT = {
    BLUEPRINTS: createContext<BlueprintStore>(null as any),
    CARDS: createContext<CardStore>(null as any),
    FAVORITES: createContext<FavoriteStore>(null as any),
    PARENT_COLUMNS: createContext<{parentColumns: GridSizeColumns, maxWidth: 1|2|3|4|5|6}>(null as any),
    FORM_GROUP_SCOPE: createContext<ObservableMap<boolean | undefined>>(null as any),
    EXCLUSIVE_SCOPE: createContext<ExclusiveScopeStore>(undefined as any),
    ANALYTICS: createContext<PiwikAnalyticsStore>(null as any),
    PRAISAL_MANAGER: createContext<PraisalManager | null>(null),
    ROUTER: createContext<RouterStore>(null as any),
    SELECTION: createContext<SelectionStore>(null as any),
}

export type Context = {
    [TProp in keyof typeof CONTEXT]: typeof CONTEXT[TProp] extends React.Context<infer TStore> ? TStore : never
}
