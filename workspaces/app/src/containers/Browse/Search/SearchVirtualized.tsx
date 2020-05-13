import * as React from 'react'
import { ListChildComponentProps, VariableSizeList } from 'react-window'

import { ListSubheader, useMediaQuery, useTheme } from '@material-ui/core'
import { RenderGroupParams } from '@material-ui/lab/Autocomplete'



// Template used from https://material-ui.com/components/autocomplete/#virtualization.
// Added `overflowX: hidden`.

const LISTBOX_PADDING = 8 // px

const renderRow = (props: ListChildComponentProps) => {
    const { data, index, style } = props
    return React.cloneElement(data[index], {
        style: {
            ...style,
            top: (style.top as number) + LISTBOX_PADDING,
        },
    })
}

const OuterElementContext = React.createContext({})

const OuterElementType = React.forwardRef<HTMLDivElement>((props, ref) => {
    const outerProps = React.useContext(OuterElementContext)
    return <div ref={ref} {...props} {...outerProps} />
})

const useResetCache = (data: number) => {
    const ref = React.useRef<VariableSizeList>(null)
    React.useEffect(() => {
        if (ref.current != null) {
            ref.current.resetAfterIndex(0, true)
        }
    }, [data])
    return ref
}

export const ListboxComponent = React.forwardRef<HTMLDivElement>((props, ref) => {
    const { children, ...other } = props
    const itemData = React.Children.toArray(children)
    const theme = useTheme()
    const smUp = useMediaQuery(theme.breakpoints.up('sm'), { noSsr: true })
    const itemCount = itemData.length
    const itemSize = smUp ? 36 : 48

    const getChildSize = (child: React.ReactNode) => {
        if (React.isValidElement(child) && child.type === ListSubheader) {
            return 48
        }

        return itemSize
    }

    const getHeight = () => {
        if (itemCount > 8) {
            return 8 * itemSize
        }
        return itemData.map(getChildSize).reduce((a, b) => a + b, 0)
    }

    const gridRef = useResetCache(itemCount)

    return (
        <div ref={ref}>
            <OuterElementContext.Provider value={other}>
                <VariableSizeList
                    style={{overflowX: 'hidden'}}
                    itemData={itemData}
                    height={getHeight() + 2 * LISTBOX_PADDING}
                    width='100%'
                    ref={gridRef}
                    outerElementType={OuterElementType}
                    innerElementType='ul'
                    itemSize={(index) => getChildSize(itemData[index])}
                    overscanCount={5}
                    itemCount={itemCount}
                >
                    {renderRow}
                </VariableSizeList>
            </OuterElementContext.Provider>
        </div>
    )
})

export const renderGroup = (params: RenderGroupParams) => [
    <ListSubheader key={params.key} component='div'>
        {params.key}
    </ListSubheader>,
    params.children,
]
