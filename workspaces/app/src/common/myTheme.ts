import { createMuiTheme, Theme, ThemeOptions } from '@material-ui/core'
import { blue, green, red, yellow } from '@material-ui/core/colors'

// Official Space Engineers colors (https://blog.marekrosa.org/2017/09/my-vision-for-visual-style-of-space.html)
export const SE_COLORS = {
    black: '#111111',
    grey: '#b6bab9',
    grey_dark: '#686868',
    white: '#efefef',

    blue    : {main: '#1767ae', dark: '#12528b', light: '#a2c2de'},
    green   : {main: '#417e3b', dark: '#34642f', light: '#b3cbb0'},
    red     : {main: '#c01118', dark: '#990d13', light: '#e59fa2'},
    yellow  : {main: '#f5bf2b', dark: '#c49822', light: '#fbe5aa'},
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
            ...blue,
            ...SE_COLORS.blue,
        },
        secondary: {
            ...yellow,
            ...SE_COLORS.yellow,
        },
        background: {
            default: SE_COLORS.grey,
            paper: SE_COLORS.white,
        },
        text: {
            primary: SE_COLORS.black,
            secondary: SE_COLORS.grey_dark,
        },

        warning: {
            ...SE_COLORS.yellow,
        },
        info: {
            ...SE_COLORS.blue,
        },
        error: {
            ...SE_COLORS.red,
        },
        success: {
            ...SE_COLORS.green,
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
