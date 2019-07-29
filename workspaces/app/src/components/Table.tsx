import 'react-table/react-table.css'

import { ObservableMap } from 'mobx'
import * as React from 'react'
import { hot } from 'react-hot-loader/root'
import ReactTable from 'react-table'

import { Checkbox } from '@material-ui/core'

import { createSmartFC, createStyles, IMyTheme } from '../common/'

// tslint:disable
// TODO: This file needs decent update.

const styles = (theme: IMyTheme) => createStyles({
    root: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    },

    td: {
        height: '100%',
        textAlign: 'right',
    },
    th: {
        height: '100%',
        textAlign: 'center',
    },
    tr: {
        alignItems: 'center',
    },
})


interface IProps<TDatum extends {} = {}> {
    className?: string
    columns: string[]
    data: TDatum[]
    headers: { [field: string]: string }

    selected?: ObservableMap<string, TDatum>

    tableProps?: {}
    selectAll?(): Promise<TDatum[]>
}


export default hot(createSmartFC(styles)<IProps>(({children, classes, ...props}) => {
    const [pages, setPages] = React.useState<number>(0)
    const [loading, setLoading] = React.useState<boolean>(true)
    const [selectAll, setSelectAll] = React.useState<number>(0)

    const toggleRow = (datum) => {
        const safeKey = getSafeKey(datum)
        if(props.selected!.get(safeKey)) {
            props.selected!.delete(safeKey)
        } else {
            props.selected!.set(safeKey, datum)
        }
        setSelectAll(2)
    }

    const toggleSelectAll = async () => {
        try {
            if (selectAll === 0) {
                props.selected!.replace(await props.selectAll!())
                setSelectAll(1)
            } else {
                props.selected!.clear()
                setSelectAll(0)
            }
        } catch(e) {
            console.error(e)
        }
    }

    const renderCheckboxColumn = () =>
        ({
            id: 'checkbox',
            accessor: '',
            Cell: ({ original }) => (<Checkbox
                    checked={props.selected!.has(getSafeKey(original))}
                    onChange={() => toggleRow(original)}
                />),
            Header: props.selectAll !== null ? () => (<Checkbox
                    checked={selectAll === 1}
                    indeterminate={selectAll === 2}
                    onChange={() => toggleSelectAll()}
                />) : undefined,
            sortable: false,
            width: 48,  // equal Checkbox default width.
            style: { padding: '0' },
            headerStyle: { padding: '0' },
        })

    const renderColumns = () => {
        const columns = props.columns.map((column) => ({
                Header: props.headers[column],
                accessor: column,
            }))
        if(props.selected) columns.unshift(renderCheckboxColumn as any)

        return columns
    }


    if(props.selected) [...props.selected]  // Trigger MobX redraw.

    return (
        <ReactTable
            style={{
                height: '100%',
            }}
            className={`-striped -highlight ${classes.root} ${props.className || ''}`}
            columns={renderColumns()}
            getTdProps={() => ({ className: classes.td })}
            getTrProps={() => ({ className: classes.tr })}
            getTheadThProps={() => ({ className: classes.th })}
            getTheadTrProps={() => ({ className: classes.tr })}
            data={props.data}
            defaultPageSize={props.data.length}
            showPagination={false}
            {...(props.tableProps || {})}
        />
    )
})) /* ============================================================================================================= */


type Datum = object | Record<string, React.ReactText | JSX.Element>
type SelectedRows = number[] | 'none' | 'all'
type Sort = [string, 'asc' | 'desc']

// tslint:disable-next-line: no-unsafe-any strict-boolean-expressions - TODO
const getSafeKey = (any) => any && (any.key || (any.dto && any.dto.accountId) || any.title || JSON.stringify(any))
