import React from "react";
import {StyledComponent, StyledWithChildren} from "../types/Types";

export interface GridTableRowComponentProps extends StyledComponent {
    row? : React.FunctionComponent<GridTableBodyRowElementProps>
    expand? : React.FunctionComponent<GridTableRowExpandElementProps>
}

export interface GridTableRowExpandElementProps extends StyledComponent {
    value : any
}

export interface GridTableBodyRowElementProps extends StyledWithChildren {
    linkTo? : string
}

