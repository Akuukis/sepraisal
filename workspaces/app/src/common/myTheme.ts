import { createMuiTheme, Theme } from '@material-ui/core'
import { green, purple, red } from '@material-ui/core/colors'

// Official Space Engineers colors (https://blog.marekrosa.org/2017/09/my-vision-for-visual-style-of-space.html)
export const SE_COLORS = {
    black: '#111111',
    blue: '#1767ae',
    green: '#417e3b',
    grey: '#b6bab9',
    grey_dark: '#686868',
    red: '#c01118',
    white: '#efefef',
    yellow: '#f5bf2b',
}


export interface IMyTheme extends Theme {
}

export const MY_LIGHT_THEME: IMyTheme = createMuiTheme({
    palette: {
        error: red,
        grey: {
            500: SE_COLORS.grey,
        },
        primary: {
            ...purple,
            500: SE_COLORS.blue,
        },
        secondary: {
            ...green,
            A400: '#00e677',
        },
    },
    spacing: 4,
    typography: {
    },
})
