import * as React from 'react'

import { SvgIcon, SvgIconProps } from '@material-ui/core'


export default (path: string, config?: SvgIconProps) => ({...otherProps}: SvgIconProps): JSX.Element =>
    (
        <SvgIcon {...config} {...otherProps}>
            {/* tslint:disable-next-line: id-length */}
            <path d={path} />
        </SvgIcon>
    )
