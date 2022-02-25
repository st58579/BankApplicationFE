import React from "react";
import {CONTENTTYPE, GridColumnConfig, VALUETYPE} from "../domain/GridConfig";
import {GridTableBodyComponentProps} from "./Types";
import {GridTableRowComponentProps} from "../gridtablerow/Types";
import {GridTableCellComponentProps} from "../gridtablebodycell/Types";
import GridTableRow from "../gridtablerow/GridTableRow";
import {getRowId} from "../common/GridUtils";
import KeyValue from "../common/KeyValue";

interface Props {
    columns: GridColumnConfig[]
    emptyColumnsCount : number
    dataRows : KeyValue<any>[]
    formatValue? : (value : any, valueType : VALUETYPE, contentType : CONTENTTYPE) => any;
    rowLink? : string,
    onSelect? : (rowId : any, selected : boolean) => void
    selectedRows? : any[]

    bodyComponentProps : GridTableBodyComponentProps
    rowComponentProps : GridTableRowComponentProps,
    cellComponentProps : GridTableCellComponentProps
}

const GridTableBody : React.FC<Props> = (props: Props) => {
    const {bodyComponentProps, rowComponentProps, cellComponentProps, dataRows, columns, formatValue, onSelect, emptyColumnsCount} = props

    const rows = dataRows.map(rowData => {
        let rowId = getRowId(rowData);
        let selected = props.selectedRows?.find(r => r === rowId) !== undefined
        return <GridTableRow key={getRowId(rowData) + ""}
                             columns={columns}
                             data={rowData}
                             formatValue={formatValue}
                             rowComponentProps={rowComponentProps}
                             cellComponentProps={cellComponentProps}
                             onSelect={onSelect}
                             selected={selected}
                             emptyColumnsCount={emptyColumnsCount}
                             rowLink={props.rowLink}

        />
    })


    if (bodyComponentProps.body === undefined) {
        return <tbody className={bodyComponentProps.className}
                      style={bodyComponentProps.style}
        >
        {rows}
        </tbody>
    }
    return React.createElement(bodyComponentProps.body, {},rows)
}

export default GridTableBody