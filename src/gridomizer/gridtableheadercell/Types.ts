import {StyledComponent, StyledWithChildren} from "../types/Types";
import {SORTORDER, VALUETYPE} from "../domain/GridConfig";
import React from "react";


export interface GridTableHeaderCellComponentProps extends StyledComponent {
    cell? : React.FunctionComponent<HeaderCellElementProps>
    selectAllCell? : React.FunctionComponent<SelectAllCellElementProps>
}

export interface SelectAllCellElementProps extends StyledComponent {
    selectLevel : SelectLevel,
    onSelect : () => void
}

export interface HeaderCellElementProps extends StyledWithChildren {
    fieldName : string
    label : string,
    valueType : VALUETYPE
    sortOrder : SORTORDER | undefined
    onSortClick : (sortOrder : SORTORDER | undefined) => void
    sortDisabled : boolean,
}

export enum SelectLevel {
    NONE = "NONE",
    ALL="ALL",
    NO_ALL="NOT_ALL"
}