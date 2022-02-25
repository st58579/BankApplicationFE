import {StyledComponent, StyledWithChildren} from "../types/Types";
import React from "react";


export interface GridTableHeaderComponentProps extends StyledComponent{
    header? : React.FunctionComponent<StyledWithChildren>
}