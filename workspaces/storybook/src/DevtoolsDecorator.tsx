import { StoryDecorator } from '@storybook/react'
import Devtools from 'mobx-react-devtools'
import * as React from 'react'

// tslint:disable-next-line:naming-convention - Quick React Node.
export const DevtoolsDecorator: StoryDecorator = (storyFn, context) => (
    <div>
        {storyFn()}
        {<Devtools />}
    </div>
)
