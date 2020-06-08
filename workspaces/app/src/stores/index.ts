import { ObservableMap } from '@sepraisal/common/src'
import { PraisalManager } from '@sepraisal/praisal'
import { createContext } from 'react'

import { GridSizeColumns } from 'src/common'

import { AbstractAnalyticsStore } from './Analytics/AbstractAnalyticsStore'
import { BlueprintStore } from './BlueprintStore'
import { CardStore } from './CardStore'
import { ExclusiveScopeStore } from './ExclusiveScopeStore'
import { FavoriteStore } from './FavoriteStore'
import { RouterStore } from './RouterStore'
import { SelectionStore } from './SelectionStore'

export const CONTEXT = {
    BLUEPRINTS: createContext<BlueprintStore>(null as never),
    CARDS: createContext<CardStore>(null as never),
    FAVORITES: createContext<FavoriteStore>(null as never),
    PARENT_COLUMNS: createContext<{parentColumns: GridSizeColumns, maxWidth: 1|2|3|4|5|6}>(null as never),
    FORM_GROUP_SCOPE: createContext<ObservableMap<boolean | undefined>>(null as never),
    EXCLUSIVE_SCOPE: createContext<ExclusiveScopeStore>(undefined as never),
    ANALYTICS: createContext<AbstractAnalyticsStore>(null as never),
    PRAISAL_MANAGER: createContext<PraisalManager | null>(null),
    ROUTER: createContext<RouterStore>(null as never),
    SELECTION: createContext<SelectionStore>(null as never),
}

export type Context = {
    [TProp in keyof typeof CONTEXT]: typeof CONTEXT[TProp] extends React.Context<infer TStore> ? TStore : never
}
