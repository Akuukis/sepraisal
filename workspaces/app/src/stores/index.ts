import { PraisalManager } from '@sepraisal/praisal'
import { createContext } from 'react'

import { BlueprintStore } from './BlueprintStore'
import { CardStore } from './CardStore'
import { PiwikStore } from './PiwikStore'
import { RouterStore } from './RouterStore'
import { SelectionStore } from './SelectionStore'


// tslint:disable: no-any
export const CONTEXT = {
    BLUEPRINTS: createContext<BlueprintStore>(null as any),
    CARDS: createContext<CardStore>(null as any),
    PIWIK: createContext<PiwikStore>(null as any),
    PRAISAL_MANAGER: createContext<PraisalManager>(null as any),
    ROUTER: createContext<RouterStore>(null as any),
    SELECTION: createContext<SelectionStore>(null as any),
}

export type Context = {
    [TProp in keyof typeof CONTEXT]: typeof CONTEXT[TProp] extends React.Context<infer TStore> ? TStore : never
}
