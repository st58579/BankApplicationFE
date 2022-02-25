import React from "react";
import {StyledComponent, StyledWithChildren} from "../types/Types";
import {GridTableComponentProps} from "../gridtable/Types";
import {GridTableHeaderComponentProps} from "../gridtableheader/Types";
import {GridTableBodyComponentProps} from "../gridtablebody/Types";
import {GridTableRowComponentProps} from "../gridtablerow/Types";
import {GridTableCellComponentProps} from "../gridtablebodycell/Types";
import {GridToolbarComponentProps} from "../gridtoolbar/Types";
import {GridTableHeaderCellComponentProps} from "../gridtableheadercell/Types";
import {CONTENTTYPE, GridConfig, VALUETYPE} from "../domain/GridConfig";
import GridData, {ExportType, GridDataRequest, GridExportDataRequest} from "../domain/GridData";

export interface CustomElements {
    grid? : GridComponentProps
    toolbar? : GridToolbarComponentProps
    table? : GridTableComponentProps
    tableHeader? : GridTableHeaderComponentProps
    tableHeaderCell? : GridTableHeaderCellComponentProps
    tableBody? : GridTableBodyComponentProps
    tableBodyRow? : GridTableRowComponentProps,
    tableBodyCell? : GridTableCellComponentProps
}

export interface GridFunctions {
    fetchGridConfig? : () => GridConfig
    fetchGridConfigAsync? : () => Promise<GridConfig>

    fetchGridData? : (request : GridDataRequest) => GridData
    fetchGridDataAsync? : (request : GridDataRequest) => Promise<GridData>

    valueFormatter? : (value : any, valueType : VALUETYPE, contentType : CONTENTTYPE) => any

    onExport? : (exportType : ExportType, request : GridExportDataRequest) => void;

    onSearch? : (mask : string, rowFields? : string[]) => GridData;
    onSearchAsync? : (mask : string, rowFields? : string[]) => Promise<GridData>;
}

export interface GridComponentProps extends StyledComponent{
    grid? : React.FunctionComponent<GridElementProps>
}

export interface GridElementProps extends StyledWithChildren {
}