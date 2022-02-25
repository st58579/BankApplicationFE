import React from "react";
import {StyledComponent, StyledWithChild} from "../types/Types";

export interface GridTableCellComponentProps extends StyledComponent {
    cell? : React.FunctionComponent<GridTableBodyCellElementProps>
    checkbox? : React.FunctionComponent<CellCheckboxElementProps>
    expand? : React.FunctionComponent<CellExpandElementProps>
}

export interface GridTableBodyCellElementProps extends StyledWithChild {
    colspan : number
}

export interface CellCheckboxElementProps extends StyledComponent {
    selected : boolean,
    onSelect : () => void
}

export interface CellExpandElementProps extends StyledComponent {
    expanded : boolean,
    onExpand : () => void
}