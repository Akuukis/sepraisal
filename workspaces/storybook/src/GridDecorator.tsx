import { DecoratorFunction } from '@storybook/addons/dist/types'
import * as React from 'react'

import { Grid } from '@material-ui/core'

export const GridDecorator = (): DecoratorFunction<React.ReactNode> => {
    return (storyFn, context) => (
            <Grid container direction='column' alignItems='center'>
                {storyFn()}
            </Grid>
    )
}
