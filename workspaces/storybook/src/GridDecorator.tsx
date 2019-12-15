import { DecoratorFunction } from '@storybook/addons/dist/types'
import { StoryFnReactReturnType } from '@storybook/react/dist/client/preview/types'
import * as React from 'react'

import { Grid } from '@material-ui/core'

export const GridDecorator = (): DecoratorFunction<StoryFnReactReturnType> => {
    return (storyFn, context) => (
            <Grid container direction='column' alignItems='center'>
                {storyFn()}
            </Grid>
    )
}
