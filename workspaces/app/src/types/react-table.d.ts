// Version 2017-05-24, retrieved 2017-09-07.

declare module 'react-table' {
    const val: ReactTable;
    export default val;
}

declare module ReactTable {
    // import * as React from 'react'

    type AccessorFunction = (row: object) => any;
    type Accessor = string | string[] | object | AccessorFunction;
    type Aggregator = (values: any, rows: any) => any;
    type TableCellRenderer = ((data: any, column: any) => React.ReactNode) | React.ReactNode;
    type FilterRender = (params: { column: Column, filter: any, onFilterChange: Function, key?: string }) => React.ReactElement<any>;

    type ComponentPropsGetter0 = (finalState: any, rowInfo: undefined, column: undefined, instance?: ReactTable) => object | undefined;
    type ComponentPropsGetterR = (finalState: any, rowInfo?: RowInfo, column?: undefined, instance?: ReactTable) => object | undefined;
    type ComponentPropsGetterC = (finalState: any, rowInfo?: undefined, column?: Column, instance?: ReactTable) => object | undefined;
    type ComponentPropsGetterRC = (finalState: any, rowInfo?: RowInfo, column?: Column, instance?: ReactTable) => object | undefined;

    /** NOTE: to many configuration ways (only true values are confusing) */
    interface SortingRule {
        id: string;
        sort?: 'desc' | 'asc';
        asc?: true;
        desc?: true;
    }

    interface TableProps extends
        Partial<TextProps>,
        Partial<ComponentDecoratorProps>,
        Partial<ControlledStateCallbackProps>,
        Partial<PivotingProps>,
        Partial<ControlledStateOverrideProps>,
        Partial<ComponentProps> {
        /** Default: [] */
        data: any[];

        /** Default: false */
        loading: boolean;

        /** Default: false */
        showPagination: boolean;

        /** Default: false */
        manual: boolean;

        /** Default: false */
        showPageSizeOptions: boolean;

        /** Default: [5, 10, 20, 25, 50, 100] */
        pageSizeOptions: number[];


        /** Display the total number of pages  */
        pages: number;

        /** Default: 20 */
        defaultPageSize: number;

        /**
         * Default: undefined
         * Otherwise take value from 'pageSize' if defined
         * @TODO: add minRows to react-table defaultProps even if undefined
         */
        minRows: number;

        /** Default: true */
        showPageJump: boolean;

        /** Default: true */
        collapseOnSortingChange: boolean;

        /** Default: true */
        collapseOnPageChange: boolean;

        /** Default: true */
        collapseOnDataChange: boolean;

        /** Default: false */
        freezeWhenExpanded: boolean;

        /** Default: [] */
        defaultSorting: SortingRule[];

        /** Default: false */
        showFilters: boolean;

        /** Default: [] */
        defaultFiltering: any[];

        /** Default: ... */
        defaultFilterMethod: (filter: any, row: any, column: any) => boolean;

        /** Default: true */
        resizable: boolean;

        /** Default: [] */
        defaultResizing: any[];

        /** On change. */
        onChange: () => any;

        /** Request new data when things change */
        onFetchData: (state: any, instance: any) => Promise<void>;

        /** Default: false */
        filterable: boolean;

        onSortedChange: (...agrs:any[])=>any;
        sorted: any[];
        /**
         * Default: ''
         * Adding a -striped className to ReactTable will slightly color odd numbered rows for legibility
         * Adding a -highlight className to ReactTable will highlight any row as you hover over it
         */
        className: string;

        /** Default: {} */
        style: object;

        /** Global Column Defaults */
        column: Partial<GlobalColumn>;

        /** Array of all Available Columns */
        columns?: Column[];

        /** Expander defaults. */
        expanderDefaults: Partial<ExpanderDefaults>;

        /** Privot defaults. */
        pivotDefaults: Partial<PivotDefaults>;
    }

    interface ControlledStateOverrideProps {
        /** Default: undefined */
        page: number;

        /** Default: undefined */
        pageSize: number;

        /** Default: undefined */
        sorting: number;

        /** Sub component */
        SubComponent: (rowInfo: RowInfo) => React.ReactNode;
    }

    interface PivotingProps {
        /** Default: undefined */
        pivotBy: string[];

        /** Default: 200 */
        pivotColumnWidth: number;

        /** Default: _pivotVal */
        pivotValKey: string;

        /** Default: _pivotID */
        pivotIDKey: string;

        /** Default: _subRows */
        subRowsKey: string;

        /**
         * Default: {} - Pivoting State Overrides (see Fully Controlled Component section)
         * @example { 4: true }
         * @example { 5: { 9: true }, 10: true }
         */
        expandedRows: ExpandedRows;

        /** Default: ??? - Pivoting State Callbacks */
        onExpandRow: Function;
    }

    interface ExpandedRows {
        [idx: number]: boolean | ExpandedRows;
    }

    interface ControlledStateCallbackProps {
        //onExpandSubComponent: Function
        onPageChange: (page: number) => void;
        onPageSizeChange: (newPageSize: number, newPage: number) => void;
        onSortingChange: (column: any, additive: boolean) => void;
        onFilteringChange: (column: any, value: any, pivotColumn: any) => void;
        onResize: (column: any, event: any, isTouch: boolean) => void;
    }

    interface ComponentDecoratorProps {
        getProps: ComponentPropsGetterRC | ComponentPropsGetterC | ComponentPropsGetter0;
        getTableProps: ComponentPropsGetter0;
        getTheadGroupProps: ComponentPropsGetter0;
        getTheadGroupTrProps: ComponentPropsGetter0;
        getTheadGroupThProps: ComponentPropsGetterC;
        getTheadProps: ComponentPropsGetter0;
        getTheadTrProps: ComponentPropsGetter0;
        getTheadThProps: ComponentPropsGetterC;
        getTheadFilterProps: ComponentPropsGetter0;
        getTheadFilterTrProps: ComponentPropsGetter0;
        getTheadFilterThProps: ComponentPropsGetterC;
        getTbodyProps: ComponentPropsGetter0;
        getTrGroupProps: ComponentPropsGetterR | ComponentPropsGetter0;
        getTrProps: ComponentPropsGetterR | ComponentPropsGetter0;

        /**
         * @TODO not exists in react-table but in the docs
         */
        //getThProps: ComponentPropsGetter
        getTdProps: ComponentPropsGetterRC | ComponentPropsGetterR;
        getTfootProps: ComponentPropsGetter0;
        getTfootTrProps: ComponentPropsGetter0;

        /**
         * @TODO not exists in react-table but in the docs
         */
        //getTfootThProps: ComponentPropsGetter
        getPaginationProps: ComponentPropsGetter0;
        getLoadingProps: ComponentPropsGetter0;
        getNoDataProps: ComponentPropsGetter0;
        getResizerProps: ComponentPropsGetter0;
    }

    interface ComponentProps {
        TableComponent: React.ReactType;
        TheadComponent: React.ReactType;
        TbodyComponent: React.ReactType;
        TrGroupComponent: React.ReactType;
        TrComponent: React.ReactType;
        ThComponent: React.ReactType;
        TdComponent: React.ReactType;
        TfootComponent: React.ReactType;
        ExpanderComponent: React.ReactType;
        PaginationComponent: React.ReactType;
        PreviousComponent: React.ReactType;
        NextComponent: React.ReactType;
        LoadingComponent: React.ReactType;
        NoDataComponent: React.ReactType;
        ResizerComponent: React.ReactType;
    }

    interface TextProps {
        /** Default: 'Previous' */
        previousText: string;

        /** Default: 'Next' */
        nextText: string;

        /** Default: 'Loading...' */
        loadingText: string;

        /** Default: 'No rows found' */
        noDataText: string;

        /** Default: 'Page' */
        pageText: string;

        /** Default: 'of' */
        ofText: string;

        /** Default: 'rows' */
        rowsText: string;
    }

    interface GlobalColumn extends
        Column.Basics,
        Column.CellProps,
        Column.FilterProps,
        Column.FooterProps,
        Column.HeaderProps {

    }

    module Column {
        /** Basic column props */
        interface Basics {
            /** Default: true */
            sortable: boolean;

            /** Default: true */
            show: boolean;

            /** Default: 100 */
            minWidth: number;
        }

        /** Configuration of a columns cell section */
        interface CellProps {
            /**
             * Default: undefined
             * A function that returns a primitive, or JSX / React Component
             *
             * @example 'Cell Value'
             * @example ({data, column}) => <div>Cell Value</div>,
             */
            render: TableCellRenderer;

            /**
             * Set the classname of the `td` element of the column
             * @default ''
             */
            className: '';

            /**
             * Set the style of the `td` element of the column
             * @default {}
             */
            style: object;

            /**
             * @default () => ({})
             */
            getProps: Function;
        }

        /** Configuration of a columns header section */
        interface HeaderProps {
            /**
             * Default: undefined
             * A function that returns a primitive, or JSX / React Component
             *
             * @example 'Header Name'
             * @example ({data, column}) => <div>Header Name</div>,
             */
            header: TableCellRenderer;

            /**
             * Set the classname of the `th` element of the column
             * @default ''
             */
            headerClassName: '';

            /**
             * Default: {}
             * Set the style of the `th` element of the column
             */
            headerStyle: object;

            /**
             * Default: (state, rowInfo, column, instance) => ({})
             * A function that returns props to decorate the `th` element of the column
             */
            getHeaderProps: Function;
        }

        /** Configuration of a columns footer section */
        interface FooterProps {
            /**
             * Default: undefined
             * A function that returns a primitive, or JSX / React Component
             *
             * @example 'Footer Name'
             * @example ({data, column}) => <div>Footer Name</div>,
             */
            footer: TableCellRenderer;

            /**
             * Default: ''
             * Set the classname of the `td` element of the column's footer
             */
            footerClassName: '';

            /**
             * Default: {}
             * Set the style of the `td` element of the column's footer
             */
            footerStyle: object;

            /**
             * Default: (state, rowInfo, column, instance) => ({})
             * A function that returns props to decorate the `th` element of the column
             */
            getFooterProps: Function;
        }

        /** Filtering related column props */
        interface FilterProps {
            /** Default: undefined */
            filterMethod: Function;

            /** Default: false */
            hideFilter: boolean;

            /** Default: ... */
            filterRender: FilterRender;
        }
    }

    interface ExpanderDefaults {
        /** Default: false */
        sortable: boolean;

        /** Default: 35 */
        width: number;

        /** Default: true */
        hideFilter: boolean;

        /** Will be overriden in methods.js to display ExpanderComponent */
        render: TableCellRenderer;
    }

    interface PivotDefaults {
        /** Will be overriden in methods.js to display ExpanderComponent */
        render: TableCellRenderer;
    }

    interface Column extends
        Partial<Column.Basics>,
        Partial<Column.CellProps>,
        Partial<Column.FilterProps>,
        Partial<Column.FooterProps>,
        Partial<Column.HeaderProps> {
        /**
         * Property name as string or Accessor
         * @example: 'myProperty'
         * @example ["a.b", "c"]
         * @example ["a", "b", "c"]
         * @example {"a": {"b": {"c": $}}}
         * @example (row) => row.propertyName
         */
        accessor?: Accessor;

        /**
         * Conditional - A unique ID is required if the accessor is not a string or if you would like to override the column name used in server-side calls
         * @example 'myProperty'
         */
        id?: string;

        /**
         * No description
         * @example (values, rows) => _.round(_.mean(values))
         * @example (values, rows) => _.sum(values)
         */
        aggregate?: Aggregator;

        /**
         * Default: undefined - A hardcoded width for the column. This overrides both min and max width options
         */
        width?: number;

        /**
         * Default: undefined - A maximum width for this column.
         * @default undefined
         */
        maxWidth?: number;

        /**
         * Turns this column into a special column for specifying expander and pivot column options.
         * If this option is true and there is NOT a pivot column, the `expanderDefaults` options will be applied on top of the column options.
         * If this option is true and there IS a pivot column, the `pivotDefaults` options will be applied on top of the column options.
         * Adding a column with the `expander` option set will allow you to rearrange expander and pivot column orderings in the table.
         * It will also let you specify rendering of the header (and header group if this special column is placed in the `columns`
         * option of another column) and the rendering of the expander itself.
         */
        expander?: boolean;

        /** Header Groups only */
        columns?: any[];
    }

    interface ColumnRenderProps {
        /** Sorted data. */
        data: any[];

        /** The column. */
        column: Column;
    }

    interface RowRenderProps extends Partial<RowInfo> {
        /** Whenever the current row is expanded */
        isExpanded?: boolean;

        /** The current cell value */
        value?: any;
    }

    interface RowInfo {
        /** Original row from your data */
        row: any;

        /** The post-accessed values from the original row */
        rowValues: any;

        /** The index of the row */
        index: number;

        /** The index of the row relative to the current page */
        viewIndex: number;

        /** The nesting depth (zero-indexed) */
        level: number;

        /** The nesting path of the row */
        nestingPath: number[];

        /** A boolean stating if the row is an aggregation row */
        aggregated: boolean;

        /** An array of any expandable sub-rows contained in this row */
        subRows: any[];
    }

    interface FinalState extends TableProps {
        startRow: number;
        endRow: number;
        pageRows: number;
        padRows: number;
        hasColumnFooter: boolean;
        canPrevious: boolean;
        canNext: boolean;
        rowMinWidth: number;
    }
}

declare interface ReactTable extends React.ComponentClass<Partial<ReactTable.TableProps>> {

}
