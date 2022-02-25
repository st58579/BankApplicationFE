import {StyledComponent, StyledWithChildren} from "../types/Types";
import React from "react";

export interface GridTableBodyComponentProps extends StyledComponent{
    body? : React.FunctionComponent<GridTableBodyElementProps>
    linkTo? : string,
}

export interface GridTableBodyElementProps extends StyledWithChildren{
}

