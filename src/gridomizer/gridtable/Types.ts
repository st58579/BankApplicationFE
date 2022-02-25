import {StyledComponent, StyledWithChildren} from "../types/Types";
import React from "react";

export interface GridTableComponentProps extends StyledComponent{
    table? : React.FunctionComponent<GridTableElementProps>
}

export interface GridTableElementProps extends StyledWithChildren {
}
