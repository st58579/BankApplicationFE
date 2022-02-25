import {GridTableCellComponentProps} from "./Types";
import React from "react";

interface Props {
    colspan : number
    value: any,
    cellComponentProps : GridTableCellComponentProps
}

const GridTableBodyCell : React.FC<Props> = (props) => {

    const {value, cellComponentProps} = props
    if (cellComponentProps.cell === undefined) {
        return <td className={cellComponentProps.className}
                   style={cellComponentProps.style}
                   colSpan={props.colspan}
        >
            {value}
        </td>
    }

    return React.createElement(cellComponentProps.cell, {
        style : cellComponentProps.style,
        className : cellComponentProps.className,
        colspan : props.colspan
    }, [value])
}

export default GridTableBodyCell