import React from 'react';
import {CONTENTTYPE, GridColumnConfig, SortCondition, SORTORDER, VALUETYPE} from "../domain/GridConfig";
import GridData from "../domain/GridData";
import {GridTableComponentProps} from "./Types";
import GridTableHeader from "../gridtableheader/GridTableHeader";
import GridTableBody from "../gridtablebody/GridTableBody";
import {GridTableHeaderComponentProps} from "../gridtableheader/Types";
import {GridTableBodyComponentProps} from "../gridtablebody/Types";
import {GridTableRowComponentProps} from "../gridtablerow/Types";
import {GridTableCellComponentProps} from "../gridtablebodycell/Types";
import {GridTableHeaderCellComponentProps, SelectLevel} from "../gridtableheadercell/Types";

interface Props {
    columns: GridColumnConfig[]
    sortConditions : SortCondition[]
    gridData: GridData,
    rowLink? : string,
    onSortClick? : (column : GridColumnConfig, order : SORTORDER | undefined) => void

    selectAllLevel : SelectLevel
    onSelectAll? : (selected : boolean) => void
    onRowSelect? : (rowId : any, selected : boolean) => void;


    selectedRows? : any[]
    formatValue? : (value : any, valueType : VALUETYPE, contentType : CONTENTTYPE) => any;

    tableComponentProps : GridTableComponentProps
    headerComponentProps : GridTableHeaderComponentProps
    headerCellComponentProps : GridTableHeaderCellComponentProps
    bodyComponentProps : GridTableBodyComponentProps
    bodyRowComponentProps : GridTableRowComponentProps,
    bodyCellComponentProps : GridTableCellComponentProps
}

const GridTable : React.FC<Props> = (props) => {

    const tableCompProps = props.tableComponentProps;

    const getEmptyColumnsCount = () : number => {
        let count = 0;
        if (props.bodyRowComponentProps.expand) {
            count++
        }
        return count
    }

    const children = [
        <GridTableHeader sortConditions={props.sortConditions}
                         columns={props.columns}
                         onSortClick={props.onSortClick}
                         headerComponentProps={props.headerComponentProps}
                         headerCellComponentProps={props.headerCellComponentProps}
                         emptyColumnsCount={getEmptyColumnsCount()}
                         selectLevel={props.selectAllLevel}
                         onSelectAll={props.onSelectAll}
                         key={1}
        />,
        <GridTableBody columns={props.columns}
                       dataRows={props.gridData.rows}
                       bodyComponentProps={props.bodyComponentProps}
                       rowComponentProps={props.bodyRowComponentProps}
                       cellComponentProps={props.bodyCellComponentProps}
                       formatValue={props.formatValue}
                       onSelect={props.onRowSelect}
                       selectedRows={props.selectedRows}
                       emptyColumnsCount={getEmptyColumnsCount()}
                       key={2}
                       rowLink={props.rowLink}
        />
    ];


    if (tableCompProps.table === undefined) {
        return <table className={tableCompProps.className} style={tableCompProps.style}>
            {children}
        </table>
    }

    return React.createElement(tableCompProps.table, {
        className : tableCompProps.className,
        style : tableCompProps.style,
        children : children
    })
}

export default GridTable