import { createMuiTheme, darken, fade, lighten, Theme, ThemeOptions } from '@material-ui/core'
import { blue, green, red, yellow } from '@material-ui/core/colors'
import { TypographyStyle, TypographyStyleOptions } from '@material-ui/core/styles/createTypography'

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

const FONT_WEIGHT_REGULAR = 400
const FONT_WEIGHT_MEDIUM = 500
const FONT_WEIGHT_BOLD = 700


export interface IMyTheme extends Theme {
    shape: Theme['shape'] & {
        boxHeight: number,
        boxWidth: number,
    },
    typography: Theme['typography'] & {
        mono: TypographyStyle
    }
}

interface IMyThemeOptions extends ThemeOptions {
    shape?: ThemeOptions['shape'] & {
        boxHeight: number,
        boxWidth: number,
    }
    typography?: ThemeOptions['typography'] & {
        mono: TypographyStyleOptions
    }
}

/*
2020-05: https://gs.statcounter.com/screen-resolution-stats
- 10.31% - 360x640
- 8.94% - 1366x768
- 7.70% - 1920x1080
- 4.52% - 375x667
- 4.45% - 414x896
- 3.29%  - 1536x864
- next - 1600x900
*/

//  xs      sm       md       lg       xl
//  0px     600px    960px    1280px   1920px - default
//  0px     640px    960px    1280px   1920px - multiples of 640: 1, 1.5, 2, 3
//  0px     600px    900px    1200px   1800px - multiples of 600: 1, 1.5, 2, 3

// Analysis
// xs-sm: stretching half column
// sm-md: whole column
// md-lg: whole column
// lg-xl: two columns
// xl+++: three columns

// Compare
// xs-sm: "sorry, please use landscape"
// sm-md: half column + fullscreen drawer
// md-lg: half column + side drawer
// lg-xl: whole column
// xl+++: whole column



const SPACING = 4  // Default is 8.
const defaultTheme = createMuiTheme({
    spacing: SPACING,
})

// www.color-hex.com/color
export const MY_LIGHT_THEME = createMuiTheme({
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1800,
        },
    },
    shape: {
        ...defaultTheme.shape,
        boxHeight: 50,
        boxWidth: 280,
    },
    palette: {
        primary: {
            ...blue,
            ...SE_COLORS.blue,
            contrastText: fade('#fff', 0.93)
        },
        secondary: {
            ...yellow,
            ...SE_COLORS.yellow,
            contrastText: fade('#fff', 0.93)
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
            contrastText: fade('#fff', 0.93)
        },
        info: {
            ...SE_COLORS.blue,
            contrastText: fade('#fff', 0.93)
        },
        error: {
            ...SE_COLORS.red,
            contrastText: fade('#fff', 0.93)
        },
        success: {
            ...SE_COLORS.green,
            contrastText: fade('#fff', 0.93)
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
        // Reserved: not visible because button's active state signals current page.
        h1: {},

        // Headings.
        h2: {
            fontWeight: FONT_WEIGHT_MEDIUM,
            fontSize: '1.75rem',
            textTransform: 'uppercase',
            textAlign: 'center',
        },
        h3: {
            fontWeight: FONT_WEIGHT_MEDIUM,
            fontSize: '1.125rem',
            lineHeight: 1.6,
        },
        h4: {  // That's only section within analysis column.
            fontWeight: FONT_WEIGHT_REGULAR,
            fontSize: '1.125rem',
            letterSpacing: undefined,
        },
        h5: {  // There's no h3 in html, but this sets h3 of cards in browse.
            fontWeight: FONT_WEIGHT_BOLD,
            fontSize: '0.9375rem',
        },

        // Similar to body, but small line height.
        subtitle1: {
            fontWeight: FONT_WEIGHT_BOLD,
            fontSize: '0.875rem',
            lineHeight: 1.2,
        },
        subtitle2: {
            fontWeight: FONT_WEIGHT_REGULAR,
            fontSize: '0.875rem',
        },

        // Similar to subtitle, but big line height appropriate for paragraphs.
        body1: {  // Also a label.
            fontWeight: FONT_WEIGHT_REGULAR,
            fontSize: '0.9375rem',
        },
        body2: {
            fontWeight: FONT_WEIGHT_REGULAR,
            fontSize: '0.875rem',
            lineHeight: 1,  // Default 1.43
            letterSpacing: 0,  // Default 0.01071em
        },

        caption: {  // Usually with `label` element.
            fontWeight: FONT_WEIGHT_REGULAR,
            fontSize: '0.6875rem',  // 11px
        },

        button: {
            fontWeight: FONT_WEIGHT_MEDIUM,
            fontSize: '0.9375rem',  // 15px
            textTransform: 'uppercase',
        },

        // Custom style for monospace, e.g. raw filters textarea.
        mono: {
            fontFamily: '"Roboto Mono", Roboto',
            fontWeight: FONT_WEIGHT_REGULAR,
            fontSize: '0.75rem',  // 11px
            lineHeight: 1.2,
            letterSpacing: 0,
        },

        // Not used.
        h6: {},
    },

    // Dense mode
    props: {
        // MuiButton: {
        //     size: 'small',
        // },
        MuiFilledInput: {
            margin: 'dense',
        },
        MuiFormControl: {
            margin: 'dense',
        },
        MuiFormHelperText: {
            margin: 'dense',
        },
        // MuiIconButton: {
        //     size: 'small',
        // },
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
        // MuiFab: {
        //     size: 'small',
        // },
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
                fontSize: '1.25em',
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
