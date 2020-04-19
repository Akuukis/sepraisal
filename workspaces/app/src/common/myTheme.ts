import { createMuiTheme, Theme } from '@material-ui/core'
import { green, purple, red } from '@material-ui/core/colors'

// Official Space Engineers colors (https://blog.marekrosa.org/2017/09/my-vision-for-visual-style-of-space.html)
export const SE_COLORS = {
    black: '#111111',
    grey: '#b6bab9',
    grey_dark: '#686868',
    white: '#efefef',

    blue: '#1767ae',
    green: '#417e3b',
    red: '#c01118',
    yellow: '#f5bf2b',
}


export interface IMyTheme extends Theme {
}

const defaultTheme = createMuiTheme()

// www.color-hex.com/color
export const MY_LIGHT_THEME: IMyTheme = createMuiTheme({
    palette: {
        primary: {
            ...red,
            main: SE_COLORS.blue,
            dark:'#12528b',  // 2 darker.
            light: '#5c94c6',  // 3 lighter.
        },
        secondary: {
            ...green,
            main: SE_COLORS.yellow,
            dark: '#c49822',  // 2 darker.
            light: '#fbe5aa',  // 6 lighter.
        },
    },
    spacing: 4,
    typography: {
        h6: {
            fontWeight: 400,
            color: defaultTheme.palette.text.primary,
        }
    },
})
