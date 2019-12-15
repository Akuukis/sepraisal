import { IMyTheme, MY_LIGHT_THEME } from '@sepraisal/app/lib/common/myTheme'
import { DecoratorFunction } from '@storybook/addons/dist/types'
import * as React from 'react'

import { createMuiTheme } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles'

const lightBaseTheme = createMuiTheme()
const darkBaseTheme = createMuiTheme({
    palette: {
        type: 'dark',
    },
})

export type ThemeDecoratorTheme = 'my' | 'light' | 'dark' | object

const themeDecorator = (theme: ThemeDecoratorTheme): DecoratorFunction<React.ReactNode> => {
    let currentTheme: IMyTheme
    switch(theme) {
        case('my'): {
            currentTheme = MY_LIGHT_THEME
            break
        }
        case('light'): {
            currentTheme = lightBaseTheme
            break
        }
        case('dark'): {
            currentTheme = darkBaseTheme
            break
        }
        default: throw new Error('catch me')
    }

    return (storyFn) => (
        <div style={{margin: '-8px'}}>
            <ThemeProvider theme={currentTheme} >
                {storyFn()}
            </ThemeProvider>
        </div>
    )
}

export default themeDecorator
