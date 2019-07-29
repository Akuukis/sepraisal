import { FC } from 'react'
import { RouteComponentProps } from 'react-router-dom'

import { FunctionComponent, FunctionComponentProps } from './Component'


interface IParamsAny {
  [param: string]: string
}

export type FunctionComponentRouted<
    TProps extends object = object,
    TClassKey extends string = string,
    TParams extends object = object
  > = FC<FunctionComponent<FunctionComponentRoutedProps<TProps, TClassKey, TParams>>>

export type FunctionComponentRoutedProps<
    TProps extends object = object,
    TClassKey extends string = string,
    TParams extends object = object
  > = FunctionComponentProps<TProps & Partial<RouteComponentProps<TParams & IParamsAny, TParams>>, TClassKey>
