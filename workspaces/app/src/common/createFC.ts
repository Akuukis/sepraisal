import { observer } from 'mobx-react-lite'
import { basename } from 'path'
import { FC } from 'react'
import { DeepPartial } from 'utility-types'

import { makeStyles, useTheme } from '@material-ui/core/styles'
import { Styles } from '@material-ui/styles/withStyles'

import { FunctionComponent, FunctionComponentProps } from './Component'
import { IMyTheme } from './myTheme'

/* eslint-disable @typescript-eslint/ban-types */  // `Record` is not solution because don't need index signature.


// TProps will be provided, but TClasses will be inferred. Due types that can't be mixed in one function.

export const createSmartFC = <TClasses extends string>(
        styles: Styles<IMyTheme, Record<string, unknown>, TClasses>,
        filepath?: string,
    ) => {
        return <TProps extends object>(
                fc: FunctionComponent<TProps, TClasses>,
            ): React.FunctionComponent<TProps & DeepPartial<FunctionComponentProps<TProps, TClasses>>> => {
                const name = filepath && basename(filepath, '.tsx')
                const useStyles = makeStyles(styles, {name})

                const wrapperFC = (props: TProps) => {
                    const theme = useTheme<IMyTheme>()
                    const classes = useStyles(props)

                    return fc({...props, theme, classes} as FunctionComponentProps<TProps, TClasses>)
                }
                wrapperFC.displayName = name

                return observer<TProps & DeepPartial<FunctionComponentProps<TProps, TClasses>>>(wrapperFC)
        }
}


export const createDumbFC = <TClasses extends string>(
        styles: Styles<IMyTheme, Record<string, unknown>, TClasses>,
        filepath?: string,
    ) => {
        return <TProps extends object>(
            fc: FunctionComponent<TProps, TClasses>,
        ): React.FunctionComponent<TProps & DeepPartial<FunctionComponentProps<TProps, TClasses>>> => {
            const name = filepath && basename(filepath, '.tsx')
            const useStyles = makeStyles(styles, {name})

            const wrapperFC = (props: TProps) => {
                const theme = useTheme<IMyTheme>()
                const classes = useStyles(props)

                return fc({...props, theme, classes} as FunctionComponentProps<TProps, TClasses>)
            }
            wrapperFC.displayName = name

            return wrapperFC
        }
}
