import React from "react";
import {SORTORDER} from "../domain/GridConfig";
import {HeaderCellElementProps} from "./Types";

const NO_SORT = '\u21C5'
const SORT_DESC = '\u2193';
const SORT_ASC = '\u2191';

const GridTableHeaderCellDefault : React.FunctionComponent<HeaderCellElementProps> = (props) => {
    const getSortOrderElement = () => {
        const sortOrder = props.sortOrder
        const onClick = props.onSortClick
        const fieldName = props.fieldName
        let nextSortOrder : SORTORDER | undefined = undefined;
        let sortSymbol = NO_SORT;

        if (sortOrder === SORTORDER.ASC) {
            nextSortOrder = SORTORDER.DESC
            sortSymbol = SORT_ASC;
        } else if (sortOrder === SORTORDER.DESC) {
            nextSortOrder = undefined
            sortSymbol = SORT_DESC;
        } else if (sortOrder === undefined) {
            nextSortOrder = SORTORDER.ASC;
            sortSymbol = NO_SORT;
        }

        return (<span
                className="grid-table-header-cell-sort"
                     onClick={e => onClick(nextSortOrder)}>
                    {sortSymbol}
                 </span>
        )
    }

    const sortOrderElement = props.sortDisabled ? undefined : getSortOrderElement()
    return (
        <th className={props.className} style={props.style}>
            <span className="grid-table-header-cell-label">{props.label}</span>
            {sortOrderElement}
            {props.children}
        </th>)
}

export default GridTableHeaderCellDefault;