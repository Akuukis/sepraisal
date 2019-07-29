import { FC } from 'react'

import { StyleRulesCallback, WithStyles } from '@material-ui/styles/withStyles'

import { IMyTheme } from './myTheme'

export type FunctionComponent<
    TProps extends object = object,
    TClassKey extends string = string,
  > = FC<FunctionComponentProps<TProps, TClassKey>>

export type FunctionComponentProps<
    TProps extends object = object,
    TClassKey extends string = string,
  > = TProps & WithStyles<StyleRulesCallback<IMyTheme, TProps, TClassKey>, true>
