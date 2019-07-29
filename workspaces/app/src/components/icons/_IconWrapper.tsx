import * as React from 'react'

import { SvgIcon } from '@material-ui/core'


export default (path: string) => ({...rest}) =>
    (
        <SvgIcon {...rest}>
            {/* tslint:disable-next-line: id-length */}
            <path d={path} />
        </SvgIcon>
    )
