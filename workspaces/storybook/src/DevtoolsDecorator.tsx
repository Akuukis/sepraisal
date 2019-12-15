import { DecoratorFunction } from '@storybook/addons/dist/types'
import Devtools from 'mobx-react-devtools'
import * as React from 'react'

// tslint:disable-next-line:naming-convention - Quick React Node.
export const DevtoolsDecorator: DecoratorFunction<React.ReactNode> = (storyFn, context) => (
    <div>
        {storyFn()}
        {<Devtools />}
    </div>
)
