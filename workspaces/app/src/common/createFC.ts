import { observer } from 'mobx-react-lite'
import { FC } from 'react'
import { DeepPartial } from 'utility-types'

import { StyleRulesCallback } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/styles'

import { FunctionComponent, FunctionComponentProps } from './Component'
import { IMyTheme } from './myTheme'


// TProps will be provided, but TClasses will be inferred. Due types that can't be mixed in one function.

export const createSmartFC = <TClasses extends string>(
        styles: StyleRulesCallback<TClasses>,
    ) => <TProps extends object>(
        fc: FunctionComponent<TProps, TClasses>,
    ) => {
        const useStyles = makeStyles(styles)
        const wrapperFC = (props: TProps) => {
            const theme = useTheme<IMyTheme>()
            const classes = useStyles(props)

            // tslint:disable-next-line: no-object-literal-type-assertion
            return fc({...props, theme, classes} as FunctionComponentProps<TProps, TClasses>)
        }

        return observer<TProps>(wrapperFC as FC<TProps>) as React.NamedExoticComponent<TProps & DeepPartial<FunctionComponentProps<TProps, TClasses>>>
    }


export const createDumbFC = <TClasses extends string>(
        styles: StyleRulesCallback<TClasses>,
    ) => <TProps extends object>(
        fc: FunctionComponent<TProps, TClasses>,
    ) => {
        const useStyles = makeStyles(styles)

        // tslint:disable-next-line: no-identical-functions - Because closure matters.
        return (props: TProps) => {
            const theme = useTheme<IMyTheme>()
            const classes = useStyles(props)

            // tslint:disable-next-line: no-object-literal-type-assertion
            return fc({...props, theme, classes} as FunctionComponentProps<TProps, TClasses>)
        }
    }
