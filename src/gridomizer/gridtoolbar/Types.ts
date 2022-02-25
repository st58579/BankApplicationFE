import {StyledComponent} from "../types/Types";
import {ExportType} from "../domain/GridData";
import React from "react";
import KeyValue from "../common/KeyValue";


export type DataModule = GridToolbarElementProps & any;

export interface GridToolbarComponentProps extends StyledComponent {
    toolbar? : React.FunctionComponent<DataModule>
}

export interface GridToolbarElementProps {
    label : string,
    columns : KeyValue<string>
    onSearch : (columns : KeyValue<string>, value1? : any, value2? : any) => void
    onExport : (type : ExportType) => void;
    onAdd : () => void
    onDelete : () => void
    totalRowsCount : number
    selectedRowsCount : number
}
