import { StoryDecorator } from '@storybook/react'
import * as React from 'react'

import { Grid } from '@material-ui/core'

export const GridDecorator = (): StoryDecorator => {
    return (storyFn, context) => (
            <Grid container direction='column' alignItems='center'>
                {storyFn()}
            </Grid>
    )
}
