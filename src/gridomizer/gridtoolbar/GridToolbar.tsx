import {GridColumnConfig} from "../domain/GridConfig";
import {ExportType, SearchCondition} from "../domain/GridData";
import {GridToolbarComponentProps} from "./Types";
import React from "react";
import {isSearchableColumn} from "../common/GridUtils";
import KeyValue from "../common/KeyValue";

interface Props {
    label : string,
    columns : GridColumnConfig[]

    onSearch : (searchConditions : SearchCondition[]) => void
    onExport : (type : ExportType) => void;
    onAdd : () => void
    onDelete : () => void
    totalRowsCount : number
    selectedRowsCount : number

    toolbarComponentProps : GridToolbarComponentProps
}

const GridToolbar : React.FC<Props> = (props) => {
    const header = props.toolbarComponentProps

    if (header.toolbar === undefined) {
        return <div className={header.className} style={header.style}>
            <span>{props.label}</span>
        </div>
    }

    const onSearch = (columns : KeyValue<string>, value1? : any, value2? : any) => {
        let searchConditions : SearchCondition[] = []

        if (value1 === undefined || value1 === "") {
            searchConditions = []
        } else {
            for (let col of props.columns) {
                if (columns[col.fieldName] !== undefined && isSearchableColumn(col)) {
                    searchConditions.push({value1 : value1, value2 : value2 ? value2 : value1, searchType : col.searchType, fieldName : col.fieldName});
                }
            }
        }

        props.onSearch(searchConditions);
    }

    const getSearchableColumns = () : KeyValue<string> => {
        let keyValue : KeyValue<string> = {}
        for (let col of props.columns) {
            if (isSearchableColumn(col)){
                keyValue[col.fieldName] = col.label;
            }
        }
        return keyValue;
    }


    return React.createElement(header.toolbar, {
        label : props.label,
        columns : getSearchableColumns(),
        onSearch : onSearch,
        onExport : props.onExport,
        onAdd : props.onAdd,
        onDelete : props.onDelete,
        totalRowsCount : props.totalRowsCount,
        selectedRowsCount : props.selectedRowsCount
    })
}

export default GridToolbar;