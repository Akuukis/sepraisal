import * as React from 'react'

import { SvgIcon, SvgIconProps } from '@material-ui/core'


export default (path: string) => ({...rest}: SvgIconProps) =>
    (
        <SvgIcon {...rest}>
            {/* tslint:disable-next-line: id-length */}
            <path d={path} />
        </SvgIcon>
    )
