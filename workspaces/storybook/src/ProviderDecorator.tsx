import { CONTEXT, Context } from '@sepraisal/app/lib/stores'
import { DecoratorFunction } from '@storybook/addons/dist/types'
import * as React from 'react'
import { $Values } from 'utility-types'

// tslint:disable: no-null-undefined-union - Because React.Node is.


export const ProviderWrapper = (stores: Partial<Context>, element: React.ReactNode | React.ReactNode[]) => {
    const storesArray = Object.entries(stores) as Array<[keyof Context, $Values<Context>]>

    const DescendIntoProviders = (children: React.ReactNode | React.ReactNode[]): React.ReactNode => {
        return storesArray.reduce<React.ReactNode>((chain, [key, store]) => {
            const Hack = CONTEXT[key].Provider

            return <Hack value={store as any}>{chain}</Hack> // tslint:disable-line:no-any no-unsafe-any
        }, children as React.ReactNode)
    }

    return DescendIntoProviders(element)
}

export const ProviderDecorator = (stores: Partial<Context>): DecoratorFunction<React.ReactNode> => {
    return (storyFn, context) => ProviderWrapper(stores, storyFn())
}
