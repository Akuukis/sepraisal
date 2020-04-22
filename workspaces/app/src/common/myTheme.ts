import { createMuiTheme, Theme, ThemeOptions } from '@material-ui/core'
import { green, red } from '@material-ui/core/colors'

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
    shape: Theme['shape'] & {
        boxHeight: number,
    }
}

interface IMyThemeOptions extends ThemeOptions {
    shape?: Theme['shape'] & {
        boxHeight: number,
    }
}

const defaultTheme = createMuiTheme()

// www.color-hex.com/color
export const MY_LIGHT_THEME = createMuiTheme({
    shape: {
        ...defaultTheme.shape,
        boxHeight: 50,
    },
    palette: {
        primary: {
            ...red,
            main: SE_COLORS.blue,
            dark:'#12528b',  // 2 darker.
            light: '#a2c2de',  // 6 lighter.
        },
        secondary: {
            ...green,
            main: SE_COLORS.yellow,
            dark: '#c49822',  // 2 darker.
            light: '#fbe5aa',  // 6 lighter.
        },
        background: {
            default: SE_COLORS.grey,
            paper: SE_COLORS.white,
        },
        text: {
            primary: SE_COLORS.black,
            secondary: SE_COLORS.grey_dark,
        },

        error: {
            main: SE_COLORS.red,
        },
        success: {
            main: SE_COLORS.green,
        },
    },
    spacing: 4,
    typography: {
        h3: {
            fontWeight: 500,
        },
        h6: {
            fontWeight: 400,
            color: defaultTheme.palette.text.primary,
        },
        subtitle1: {  // Usually with `strong` element.
        },
        subtitle2: {  // Usually with `em` element.
            fontStyle: 'normal',
            fontStretch: 'condensed',
        },
        caption: {  // Usually with `label` element.
            fontSize: '0.675rem',
        },
    },
} as IMyThemeOptions) as IMyTheme
