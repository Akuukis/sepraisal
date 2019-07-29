import { CONTEXT, Context } from '@sepraisal/app/lib/stores'
import { Renderable, StoryDecorator } from '@storybook/react'
import * as React from 'react'
import { $Values } from 'utility-types'

// tslint:disable-next-line:naming-convention - Quick React Node.
export const ProviderWrapper = (stores: Partial<Context>, element: Renderable | Renderable[]) => {
    const storesArray = Object.entries(stores) as Array<[keyof Context, $Values<Context>]>

    const DescendIntoProviders = (children: Renderable | Renderable[]): Renderable => {
        return storesArray.reduce<Renderable>((chain, [key, store]) => {
            const Hack = CONTEXT[key].Provider

            return <Hack value={store as any}>{chain}</Hack> // tslint:disable-line:no-any no-unsafe-any
        }, children as Renderable)
    }

    return DescendIntoProviders(element)
}

// tslint:disable-next-line:naming-convention - Quick React Node.
export const ProviderDecorator = (stores: Partial<Context>): StoryDecorator => {
    // tslint:disable-next-line:no-any - TODO
    return (storyFn, context) => ProviderWrapper(stores, storyFn())

}
