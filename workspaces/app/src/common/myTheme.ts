import { createMuiTheme, darken, lighten, Theme, ThemeOptions } from '@material-ui/core'
import { blue, green, red, yellow } from '@material-ui/core/colors'

// Official Space Engineers colors (https://blog.marekrosa.org/2017/09/my-vision-for-visual-style-of-space.html)
export const SE_COLORS = {
    black: '#111111',
    grey: '#b6bab9',
    grey_dark: '#686868',
    white: '#efefef',

    blue    : {main: '#1767ae', dark: darken('#1767ae', 0.2), light: lighten('#1767ae', 0.6)},
    green   : {main: '#417e3b', dark: darken('#417e3b', 0.2), light: lighten('#417e3b', 0.6)},
    red     : {main: '#c01118', dark: darken('#c01118', 0.2), light: lighten('#c01118', 0.6)},
    yellow  : {main: '#f5bf2b', dark: darken('#f5bf2b', 0.2), light: lighten('#f5bf2b', 0.6)},
}

export const STEAM_COLORS = {
    blue: '#1b2838',
    grey: '#acb2b8',
    white: '#ffffff',
}
export const THUMB_WIDTH = 268
export const THUMB_HEIGHT = 151


export interface IMyTheme extends Theme {
    shape: Theme['shape'] & {
        boxHeight: number,
        boxWidth: number,
    }
}

interface IMyThemeOptions extends ThemeOptions {
    shape?: Theme['shape'] & {
        boxHeight: number,
        boxWidth: number,
    }
}

const SPACING = 4  // Default is 8.
const defaultTheme = createMuiTheme({
    spacing: SPACING,
})

// www.color-hex.com/color
export const MY_LIGHT_THEME = createMuiTheme({
    shape: {
        ...defaultTheme.shape,
        boxHeight: 50,
        boxWidth: THUMB_WIDTH,
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
    spacing: SPACING,

    /**
     * 10px = 0.625rem
     * 12px = 0.75rem
     * 14px = 0.875rem
     * 16px = 1rem (base)
     * 18px = 1.125rem
     * 20px = 1.25rem
     * 24px = 1.5rem
     * 30px = 1.875rem
     * 32px = 2rem
     */
    typography: {
        h3: {
            fontWeight: 500,
        },
        h6: {
            fontSize: '1.125rem',  // 1.25
        },
        subtitle1: {  // Usually with `strong` element.
        },
        subtitle2: {  // Usually with `em` element.
            fontStyle: 'normal',
            fontStretch: 'condensed',
        },
        caption: {  // Usually with `label` element.
            fontSize: '0.675rem', // 0.75
        },
    },

    // Dense mode
    props: {
        MuiButton: {
            size: 'small',
        },
        MuiFilledInput: {
            margin: 'dense',
        },
        MuiFormControl: {
            margin: 'dense',
        },
        MuiFormHelperText: {
            margin: 'dense',
        },
        MuiIconButton: {
            size: 'small',
        },
        MuiInputBase: {
            margin: 'dense',
        },
        MuiInputLabel: {
            margin: 'dense',
        },
        MuiListItem: {
            dense: true,
        },
        MuiOutlinedInput: {
            margin: 'dense',
        },
        MuiFab: {
            size: 'small',
        },
        MuiTable: {
            size: 'small',
        },
        MuiTextField: {
            margin: 'dense',
        },
        MuiToolbar: {
            variant: 'dense',
        },
        MuiSvgIcon: {
            fontSize: 'small',
        },
    },
    overrides: {
        MuiExpansionPanelSummary: {
            root: {
                padding: defaultTheme.spacing(0, 3),  // Normally 24px, wasn't scaled using spacing.
            },
        },
        MuiIconButton: {
            sizeSmall: {
                // Adjust spacing to reach minimal touch target hitbox
                // marginLeft: 4,
                // marginRight: 4,
                padding: 12,
            },
        },
        MuiListItem: {
            gutters: {
                paddingLeft: defaultTheme.spacing(2),
            },
        },
        MuiListItemSecondaryAction: {
            root: {
                right: 4,  // For dense, as marginRight above. Normally 16px.
            }
        },
        MuiLink: {
            root: {
                color: SE_COLORS.blue.dark,
            },
        },
    },
} as IMyThemeOptions) as IMyTheme
