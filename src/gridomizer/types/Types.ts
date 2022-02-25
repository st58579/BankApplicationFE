import {CSSProperties, Key, ReactNode} from "react";


export interface StyledComponent {
    className? : string
    style? : CSSProperties,
    elementKey? : Key
}

export interface StyledWithChild extends StyledComponent {
    children? : ReactNode
}

export interface StyledWithChildren extends StyledComponent {
    children? : ReactNode[]
}