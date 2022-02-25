import {COLUMNTYPE, GridColumnConfig, GridConfig, SortCondition, SORTORDER,} from "../domain/GridConfig";
import GridData, {ExportType, GridDataRequest, GridExportDataRequest, SearchCondition} from "../domain/GridData";
import React, {ReactNode} from "react";
import {CustomElements, GridFunctions} from "./Types";
import GridTable from "../gridtable/GridTable";
import {getRowIds} from "../common/GridUtils";
import GridToolbar from "../gridtoolbar/GridToolbar";
import {SelectLevel} from "../gridtableheadercell/Types";

const EMPTY_GRID_CONFIG : GridConfig = {
    clazz : "",
    gridName : "",
    gridLabel : "",
    defaultRowsCount : 0,
    columns : [],
    defaultSortConditions : []
}

const EMPTY_DATA : GridData = {
    gridName: "",
    currentCount: 0,
    currentOffset: 0,
    rows: [],
    sortConditions : [],
    searchConditions : []
}

interface Props {
    gridConfig?: GridConfig,
    label? : string,
    gridData? : GridData
    rowLink? : string
    selectable? : boolean,
    singleSort? : boolean
    elements? : CustomElements,
    functions? : GridFunctions,
    initialSearchConditions? : SearchCondition[]
}

interface State {
    gridConfig: GridConfig
    gridData : GridData
    searchConditions : SearchCondition[],
    sortConditions : SortCondition[],
    selectedRows : any[]
}

export default class Grid extends React.Component<Props, State> {

    state : Readonly<State> = {
        gridData : this.props.gridData ? this.props.gridData : EMPTY_DATA,
        gridConfig : this.props.gridConfig ? this.props.gridConfig : EMPTY_GRID_CONFIG,
        searchConditions : this.props.gridData ? this.props.gridData?.searchConditions : [],
        sortConditions : this.props.gridData ? this.props.gridData?.sortConditions : [],
        selectedRows : []

    }

    componentDidMount() {
        this.fetchGridConfigAndDataAtInit();
    }

    private fetchGridConfigAndDataAtInit = () => {
        const functions = this.props.functions;
        if (functions === undefined) {
            return;
        }
        if (functions.fetchGridConfig) {
            let config = functions.fetchGridConfig();
            this.setState({gridConfig : config, sortConditions : config.defaultSortConditions, searchConditions : []})
            this.fetchGridData(undefined, config.defaultSortConditions, undefined, undefined)
        } else if (functions.fetchGridConfigAsync) {
            functions.fetchGridConfigAsync().then(config => {
                const initialSearchConditions : SearchCondition[] | undefined = this.props.initialSearchConditions;
                this.setState({gridConfig : config, sortConditions : config.defaultSortConditions, searchConditions : []})
                this.fetchGridData(undefined, config.defaultSortConditions, config.defaultRowsCount, 0)
            });
        } else {
        }
    }

    private fetchFilteredGridData = (searchConditions : SearchCondition[]) => {
        this.fetchGridData(searchConditions, undefined, undefined, undefined)
    }

    private fetchSortedGridData = (conditions : SortCondition[]) => {
        this.fetchGridData(undefined, conditions, undefined, undefined)
    }

    private fetchGridData = (searchConditions? : SearchCondition[], sortConditions? : SortCondition[], count? : number, offset? : number) => {
        const functions = this.props.functions;
        if (functions === undefined) {
            return;
        }
        let gridData = this.state.gridData
        let config = this.state.gridConfig;
        let currentCount = count ? count : config.defaultRowsCount;
        let currentOffset = offset ? offset : gridData.currentOffset;
        let currentSort = sortConditions ? sortConditions : gridData.sortConditions;
        let currentSearch = searchConditions ? searchConditions : gridData.searchConditions;

        if (this.props.initialSearchConditions && this.props.initialSearchConditions.length > 0){
            currentSearch = currentSearch.concat(this.props.initialSearchConditions);
        }

        let request : GridDataRequest = { count : currentCount , offset : currentOffset, searchConditions :  currentSearch, sortConditions : currentSort }

        if (functions.fetchGridData) {
            let data = functions.fetchGridData(request);
            this.setState({gridData : data, searchConditions : currentSearch, sortConditions : currentSort})
        } else if (functions.fetchGridDataAsync) {
            functions.fetchGridDataAsync(request).then(data => {
                this.setState({gridData : data, searchConditions : currentSearch, sortConditions : currentSort})
            });
        } else {
        }
    }

    private onGridSort = (column : GridColumnConfig, sortOrder? : SORTORDER) => {
        const singleSort = this.props.singleSort;
        let conditions = this.state.sortConditions;
        let currentCondition = conditions.find(c => c.field === column.fieldName);

        let lastNumber = conditions.map(c => c.conditionNo).sort((c1, c2) => c1 - c2).pop();
        if (lastNumber === undefined) {
            lastNumber = 1;
        }

        if (sortOrder === undefined) {
            conditions = conditions.filter(c => c.field != column.fieldName)
        } else if (currentCondition === undefined) {
            currentCondition = {field: column.fieldName, sortOrder : sortOrder, conditionNo : lastNumber + 1};
            if (singleSort) {
                currentCondition.conditionNo = 0;
                conditions = []
            }
            conditions.push(currentCondition);
        } else {
            currentCondition.conditionNo = lastNumber + 1;
            currentCondition.sortOrder = sortOrder;
        }
        conditions = this.recalculateSortNumbers(conditions);
        this.fetchSortedGridData(conditions)
    }

    private recalculateSortNumbers(conditions : SortCondition[]) : SortCondition[]   {
        conditions = conditions.sort((c1, c2) => c1.conditionNo - c2.conditionNo);
        let currentNo = 1;
        for (let cond of conditions) {
            cond.conditionNo = currentNo++;
        }
        return conditions;
    }

    private filterAndSortColumns = () : GridColumnConfig[] => {
        const columns = this.state.gridConfig.columns
        return columns.filter(col => col.columnType !== COLUMNTYPE.HIDDEN_FIELD)
            .sort((c1, c2) => c1.columnNumber - c2.columnNumber)
    }

    private onExport = (type : ExportType) => {
        let gridData = this.state.gridData
        let sortConditions = gridData.sortConditions;
        let searchConditions = gridData.searchConditions;
        const request : GridExportDataRequest = {searchConditions, sortConditions, ids : this.state.selectedRows}
        if (this.props.functions?.onExport) {
            this.props.functions?.onExport(type, request);
        }
    }

    private onAdd = () => {
    }

    private onDelete = () => {
    }

    private onSelectRow = (rowId : any, selected : boolean) => {
        let selectedRows = this.state.selectedRows;
        if (selected) {
            selectedRows.push(rowId);
        } else {
            selectedRows = selectedRows.filter(r => Number(r !== rowId));
        }
        this.setState({selectedRows : selectedRows});
    }

    private onSelectAll = (selected : boolean) => {
        let selectedRows: any[];
        if (selected) {
            selectedRows = getRowIds(this.state.gridData.rows)
        } else {
            selectedRows = [];
        }
        this.setState({selectedRows : selectedRows});
    }

    private renderToolBar = () : ReactNode => {
        const elements = this.props.elements
        const header = elements?.toolbar ? elements?.toolbar : {}
        let {gridLabel, columns} = this.state.gridConfig;
        if (this.props.label) {
            gridLabel = this.props.label;
        }
        const key = gridLabel + "header"
        return <GridToolbar
            key={key}
            label={gridLabel}
            columns={columns}
            onSearch={this.fetchFilteredGridData}
            onExport={this.onExport}
            onAdd={this.onAdd}
            onDelete={this.onDelete}
            toolbarComponentProps={header}
            selectedRowsCount={this.state.selectedRows.length}
            totalRowsCount={this.state.gridData.rows.length}
            />
    }

    private renderGridTable = () : ReactNode => {
        const elements = this.props.elements
        const columns = this.filterAndSortColumns();
        const sortConditions = this.state.sortConditions
        const gridData = this.state.gridData
        const key = this.props.gridConfig?.gridLabel + "body"

        const table = elements?.table ? elements?.table : {}
        const header = elements?.tableHeader ? elements?.tableHeader : {}
        const headerCell = elements?.tableHeaderCell ? elements?.tableHeaderCell : {}
        const body = elements?.tableBody ? elements?.tableBody : {}
        const bodyRow = elements?.tableBodyRow ? elements?.tableBodyRow : {}
        const bodyCell = elements?.tableBodyCell ? elements?.tableBodyCell : {}
        const formatter = this.props.functions ? this.props.functions.valueFormatter : undefined;
        const onRowSelect = this.props.selectable ? this.onSelectRow : undefined;
        const onSelectAll = this.props.selectable ? this.onSelectAll : undefined;
        const selectRowsCount = this.state.selectedRows.length;
        const allRowsCount = this.state.gridData.rows.length
        const selectLevel = selectRowsCount === 0 ? SelectLevel.NONE : allRowsCount === selectRowsCount ? SelectLevel.ALL : SelectLevel.NO_ALL
        return <GridTable
            key={key}
            gridData={gridData}
            sortConditions={sortConditions}
            columns={columns}
            onSortClick={this.onGridSort}
            bodyComponentProps={body}
            bodyRowComponentProps={bodyRow}
            bodyCellComponentProps={bodyCell}
            tableComponentProps={table}
            headerComponentProps={header}
            headerCellComponentProps={headerCell}
            onRowSelect={onRowSelect}
            onSelectAll={onSelectAll}
            selectAllLevel={selectLevel}
            selectedRows={this.state.selectedRows}
            formatValue={formatter}
            rowLink={this.props.rowLink}
        />
    }


    render() {
        const elements = this.props.elements
        if (elements === undefined || elements?.grid === undefined || elements.grid.grid === undefined) {
            return (
                <div>
                    {this.renderToolBar()}
                    {this.renderGridTable()}
                </div>
            )
        } else {
            return React.createElement(elements.grid.grid, {
                style : elements.grid.style,
                className : elements.grid.className,
                children : [
                    this.renderToolBar(),
                    this.renderGridTable()
                ]
            })
        }
    }

}
